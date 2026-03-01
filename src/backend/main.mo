import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import AccessControl "./authorization/access-control";
import BlobStorageMixin "./blob-storage/Mixin";
import AuthMixin "./authorization/MixinAuthorization";

actor {

  transient let accessControlState : AccessControl.AccessControlState = AccessControl.initState();

  include AuthMixin(accessControlState);
  include BlobStorageMixin();

  // ── Types ──────────────────────────────────────────────────────────────

  type UserId = Principal;

  type UserProfile = {
    displayName : Text;
    partnerNickname : Text;
  };

  // Immutable post record (no var fields to avoid type issues)
  type PostRecord = {
    postId : Nat;
    coupleId : Text;
    blobHash : Text;
    caption : Text;
    senderUserId : UserId;
    senderName : Text;
    timestamp : Int;
  };

  type PostView = {
    postId : Nat;
    coupleId : Text;
    blobHash : Text;
    caption : Text;
    senderUserId : UserId;
    senderName : Text;
    timestamp : Int;
    hearts : Nat;
    heartedByMe : Bool;
  };

  type CoupleSpace = {
    coupleId : Text;
    inviteCode : Text;
    partner1 : UserId;
    var partner2 : ?UserId;
    createdAt : Int;
  };

  type CoupleInfo = {
    coupleId : Text;
    inviteCode : Text;
    partner1 : UserId;
    partner1Name : Text;
    partner2 : ?UserId;
    partner2Name : ?Text;
    createdAt : Int;
  };

  // ── State ──────────────────────────────────────────────────────────────

  let profiles : Map.Map<UserId, UserProfile> = Map.empty();
  let coupleByCode : Map.Map<Text, Text> = Map.empty();
  let coupleSpaces : Map.Map<Text, CoupleSpace> = Map.empty();
  let userCouple : Map.Map<UserId, Text> = Map.empty();
  // heartKey = "userId:postId" -> ()
  let heartedPosts : Map.Map<Text, ()> = Map.empty();
  // postId -> heart count
  let heartCounts : Map.Map<Nat, Nat> = Map.empty();
  var allPosts : [PostRecord] = [];
  var nextPostId : Nat = 0;

  // ── Helpers ────────────────────────────────────────────────────────────

  func requireAuth(caller : UserId) {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
  };

  let defaultProfile : UserProfile = {
    displayName = "My Love";
    partnerNickname = "My Love";
  };

  func lookupProfile(userId : UserId) : UserProfile {
    switch (profiles.get(userId)) {
      case (?p) p;
      case null defaultProfile;
    }
  };

  func makeInviteCode(seed : Int) : Text {
    let alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let chars : [Char] = alphabet.chars() |> Array.fromIter(_);
    var n : Nat = Int.abs(seed) % 1_000_000_000;
    var code = "";
    var i = 0;
    while (i < 6) {
      code #= Text.fromChar(chars[n % 32]);
      n := (n / 32 + i * 17 + 3) % 1_000_000_000;
      i += 1;
    };
    code
  };

  func makeCoupleId(p : Principal, ts : Int) : Text {
    let pText = p.toText();
    let chars = pText.chars() |> Array.fromIter(_);
    let len = chars.size();
    let take = if (len > 6) 6 else len;
    let short = chars.sliceToArray(0, take).vals() |> Text.fromIter(_);
    short # "-" # (Int.abs(ts) % 100_000).toText()
  };

  func getHearts(postId : Nat) : Nat {
    switch (heartCounts.get(postId)) {
      case (?n) n;
      case null 0;
    }
  };

  // ── Profile ────────────────────────────────────────────────────────────

  public shared ({ caller }) func setProfile(displayName : Text, partnerNickname : Text) : async () {
    requireAuth(caller);
    profiles.add(caller, { displayName; partnerNickname });
  };

  public query ({ caller }) func getMyProfile() : async UserProfile {
    requireAuth(caller);
    lookupProfile(caller)
  };

  // ── Couple Space ────────────────────────────────────────────────────────

  public shared ({ caller }) func createCoupleSpace() : async { coupleId : Text; inviteCode : Text } {
    requireAuth(caller);
    switch (userCouple.get(caller)) {
      case (?cId) {
        switch (coupleSpaces.get(cId)) {
          case (?cs) return { coupleId = cs.coupleId; inviteCode = cs.inviteCode };
          case null {};
        };
      };
      case null {};
    };
    let ts = Time.now();
    let coupleId = makeCoupleId(caller, ts);
    let code = makeInviteCode(ts);
    let cs : CoupleSpace = {
      coupleId;
      inviteCode = code;
      partner1 = caller;
      var partner2 = null;
      createdAt = ts;
    };
    coupleSpaces.add(coupleId, cs);
    coupleByCode.add(code, coupleId);
    userCouple.add(caller, coupleId);
    { coupleId; inviteCode = code }
  };

  public shared ({ caller }) func joinCoupleSpace(inviteCode : Text) : async { coupleId : Text } {
    requireAuth(caller);
    let cId = switch (coupleByCode.get(inviteCode)) {
      case null Runtime.trap("Invalid invite code");
      case (?id) id;
    };
    let cs = switch (coupleSpaces.get(cId)) {
      case null Runtime.trap("Couple space not found");
      case (?c) c;
    };
    if (cs.partner1 == caller) Runtime.trap("You created this space");
    switch (cs.partner2) {
      case (?_) Runtime.trap("Space already full");
      case null {
        cs.partner2 := ?caller;
        userCouple.add(caller, cId);
        { coupleId = cId }
      };
    }
  };

  public query ({ caller }) func getMyCoupleInfo() : async ?CoupleInfo {
    requireAuth(caller);
    let cId = switch (userCouple.get(caller)) {
      case null return null;
      case (?id) id;
    };
    let cs = switch (coupleSpaces.get(cId)) {
      case null return null;
      case (?c) c;
    };
    let p1Name = lookupProfile(cs.partner1).displayName;
    let p2Name : ?Text = switch (cs.partner2) {
      case null null;
      case (?p2) ?(lookupProfile(p2).displayName);
    };
    ?{
      coupleId = cs.coupleId;
      inviteCode = cs.inviteCode;
      partner1 = cs.partner1;
      partner1Name = p1Name;
      partner2 = cs.partner2;
      partner2Name = p2Name;
      createdAt = cs.createdAt;
    }
  };

  // ── Posts ──────────────────────────────────────────────────────────────

  public shared ({ caller }) func createPost(blobHash : Text, caption : Text) : async Nat {
    requireAuth(caller);
    let cId = switch (userCouple.get(caller)) {
      case null Runtime.trap("Not in a couple");
      case (?id) id;
    };
    let profile = lookupProfile(caller);
    let pid = nextPostId;
    let p : PostRecord = {
      postId = pid;
      coupleId = cId;
      blobHash;
      caption;
      senderUserId = caller;
      senderName = profile.displayName;
      timestamp = Time.now();
    };
    let newPosts = Array.tabulate(allPosts.size() + 1, func(i) {
      if (i < allPosts.size()) allPosts[i] else p
    });
    allPosts := newPosts;
    nextPostId += 1;
    pid
  };

  public query ({ caller }) func getFeed() : async [PostView] {
    requireAuth(caller);
    let cId = switch (userCouple.get(caller)) {
      case null return [];
      case (?id) id;
    };
    let mine = allPosts.filter(func(p : PostRecord) : Bool { p.coupleId == cId });
    let sorted = mine.sort(func(a : PostRecord, b : PostRecord) : { #less; #equal; #greater } {
      if (a.timestamp > b.timestamp) #less
      else if (a.timestamp < b.timestamp) #greater
      else #equal
    });
    sorted.map(func(p : PostRecord) : PostView {
      let key = caller.toText() # ":" # p.postId.toText();
      {
        postId = p.postId;
        coupleId = p.coupleId;
        blobHash = p.blobHash;
        caption = p.caption;
        senderUserId = p.senderUserId;
        senderName = p.senderName;
        timestamp = p.timestamp;
        hearts = getHearts(p.postId);
        heartedByMe = switch (heartedPosts.get(key)) { case (?_) true; case null false };
      }
    })
  };

  public shared ({ caller }) func toggleHeart(postId : Nat) : async Nat {
    requireAuth(caller);
    let key = caller.toText() # ":" # postId.toText();
    // Verify post exists in caller's couple
    let exists = switch (userCouple.get(caller)) {
      case null false;
      case (?cId) {
        allPosts.filter(func(p : PostRecord) : Bool { p.postId == postId and p.coupleId == cId }).size() > 0
      };
    };
    if (not exists) Runtime.trap("Post not found");
    let currentHearts = getHearts(postId);
    let newHearts = switch (heartedPosts.get(key)) {
      case (?_) {
        heartedPosts.remove(key);
        if (currentHearts > 0) currentHearts - 1 else 0
      };
      case null {
        heartedPosts.add(key, ());
        currentHearts + 1
      };
    };
    heartCounts.add(postId, newHearts);
    newHearts
  };
}
