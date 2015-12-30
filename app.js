(function() {

  return {
    events: {
      'app.activated': 'appInit',
      'comment.text.changed':'checkText',
      'click .add_shortcut': 'openModal',
      'click .list_shortcuts': 'openListModal',
      'click .save_button': 'saveShortcut',
      'keypress .replace_input': 'enterKeyPressed',
      'hidden .modal': function(){ this.switchTo('home');},
      'click .delete_shortcut': 'deleteShortcut'
    },

    requests: {
      updateAppInstallation: function(installationId, shortcutString){
        return {
          url: '/api/v2/apps/installations/'+ installationId +'.json',
          type: 'PUT',
          dataType: 'json',
          data: {
            'settings': { "shortcuts" : shortcutString }
          }
        };
      }
    },

    saveShortcut: function(){
      var _shortcut = this.$('.shortcut_input:last').val().trim();
      var _replacer = this.$('.replace_input:last').val().trim();
      if( _shortcut !== "" && _replacer !== "" ){
        this.addUserShortcut(_shortcut,_replacer);
        this.addInputRow();
      }
    },

    openModal: function(){
      this.switchTo('add_shortcut_modal');
      this.$('#add_shortcut_modal').modal('toggle');
      this.addInputRow(); //Adds the first input row to the form.
    },

    openListModal: function(){
      this.switchTo('list_modal', { shortcuts: this.shortcuts[this.currentUser().id()] });
      this.$('#list_modal').modal('toggle');
    },

    deleteShortcut: function(e){
      var _key_for_deletion = this.$(e.target).data('key');
      this.shortcuts[this.currentUser().id()] = _.omit(this.shortcuts[this.currentUser().id()], _key_for_deletion);
      this.$(e.target).closest('tr').remove();
      this.updateApp();
    },

    appInit: function(){
      this.shortcuts = JSON.parse(this.setting('shortcuts'));
      console.log(this.shortcuts[this.currentUser().id()]);
      this.switchTo('home');
    },

    checkText: _.debounce( function() {
      var shared = this.shortcuts['shared'];
      var userShortcuts = this.shortcuts[this.currentUser().id()];
      //for each of the shared shortcuts. replace
      this.matchAndReplace(shared);
      //for each user specific, replace.
      this.matchAndReplace(userShortcuts);
    }, 200),

    matchAndReplace: function(shortcuts){
      for(var element_key in shortcuts ){
        var regex = new RegExp("\\s" + element_key + "\\s", "g");
        this.comment().text( this.comment().text().replace(regex, " " + shortcuts[element_key] + " ") );
      }
    },

    addUserShortcut: function(shortcut, replace){
      this.shortcuts[this.currentUser().id()][shortcut] = replace;
      this.updateApp();
    },

    updateApp: function(){
      this.ajax('updateAppInstallation', this.installationId(), JSON.stringify(this.shortcuts) );
    },

    addInputRow: function(){
      this.$('#shortcut_form').append(this.renderTemplate('input_row'));
      //Requests focus to the last added row
      this.$('.shortcut_input:last').focus();
    },

    enterKeyPressed: function(e){
      if(e.which == 13){
        this.saveShortcut();
      }
    }

  };

}());
