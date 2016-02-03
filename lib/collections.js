Websites = new Mongo.Collection("websites");
Comment = new Mongo.Collection("comment");

/**
 * Permissions rules for security
 * Allow and deny methods to control who can perform which operations on the database.
 */
Websites.allow({
    insert: function(userId, doc) {
        if (Meteor.user()) {
            // user is logged in
            return true;
        }
        // user not logged in
        return false;
    },
    update: function(userId, doc) {
        if (Meteor.user()) {
            // user is logged in
            return true;
        }
        // user not logged in
        return false;
    }
});

Comment.allow({
    insert: function(userId, doc) {
        if (Meteor.user()) {
            return true;
        }
        return false;
    }
});