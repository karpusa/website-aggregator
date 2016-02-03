/// accounts config

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
});

/// routing

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('navbar', {
    to: "navbar"
  });
  this.render('websites', {
    to: "main"
  });
});

Router.route('/site/:_id', function () {
  this.render('navbar', {
    to: "navbar"
  });
  this.render('website', {
    to: "main",
    data:function(){
        return Websites.findOne({_id:this.params._id});
    }
  });
});


/////
// template helpers
/////

Template.registerHelper("formatDate", function(date, format) {
    return moment(date).format(format);
});

Template.website_form.helpers({
    getWebsiteTitle: function() {
        return Session.get("website_title");
    },
    getWebsiteDescription: function() {
        return Session.get("website_description");
    },
    fill_site_address: function() {
        if (Session.get("fill_site_address")){
            return true;
        }
        return false;
    }

});

// helper function that returns all available websites
Template.website_list.helpers({
    websites:function(){
        return Websites.find({},{sort:{vote: -1}});
    }
});

Template.comment_list.helpers({
    comments:function(){
        var site_id = this._id;

        return Comment.find({siteId:site_id},{sort:{createdOn: -1}});
    }
});

Template.comment_item.helpers({
    getUser:function(user_id){
      var user = Meteor.users.findOne({_id:user_id});
      if (user){
        return user.username;
      }
      else {
        return "anonymous";
      }
    }
});



/////
// template events
/////

Template.website_item.events({
    "click .js-upvote":function(event){
        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;

        //Up a vote to a website!
        Websites.update(website_id, {$inc: {vote: 1}});

        return false;// prevent the button from reloading the page
    },
    "click .js-downvote":function(event){

        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;

        //Down a vote to a website!
        Websites.update(website_id, {$inc: {vote: -1}});

        return false;// prevent the button from reloading the page
    }
})

Template.website_form.events({
    "click .js-toggle-website-form": function(event){
        $("#website_form").toggle('slow');
    },
    "click .js-site-check": function(event){

        // here is an example of how to get the url out of the form:
        var url = $('#url').val();

        Meteor.call("getContentsByUrl", url,  function (error, result) {
            if (result) {
                Session.set("fill_site_address", true);
                Session.set("website_title", result.title);
                Session.set("website_description", result.description);
            } else {
                Session.set("fill_site_address", undefined);
                Session.set("website_title", undefined);
                Session.set("website_description", undefined);
                console.log('Http url error');
            }
        });
    },
    "click .js-site-reset": function(event){
        Session.set("fill_site_address", undefined);
        Session.set("website_title", undefined);
        Session.set("website_description", undefined);
        $('#url').val('');
    },
    "click .js-site-add": function(event){
        var url = $('#url').val(),
            title = $('#title').val(),
            description = $('#description').val();

        Session.set("fill_site_address", undefined);
        Session.set("website_title", undefined);
        Session.set("website_description", undefined);
        $('#url').val('');
        $("#website_form").hide();

        Websites.insert({
            title: title,
            url: url,
            description: description,
            createdOn: new Date(),
            vote: 0
        });

    }
});

Template.comment_form.events({
    "submit .js-comment-form": function(event){
        event.preventDefault();
        var site_id = this._id,
            comment = event.target.comment.value;

        // Insert a comment into the collection
        Comment.insert({
            comment: comment,
            siteId: site_id,
            createdBy: Meteor.user()._id,
            createdOn: new Date() // current time
        });

        // Clear form
        event.target.comment.value = "";
    },
});