(function() {

  return {
    events: {
      'app.activated': 'appInit',
      'comment.text.changed':'checkText',
      'click .add_shortcut': 'openModal',
      'click .list_shortcuts': 'openListModal',
      'click .save_button': 'saveShortcut',
      'keypress .replace_input': 'enterKeyPressed',
      'click .delete_shortcut': 'deleteShortcut',
      'click #on_off_switch': 'toggleOnOff',
      'hidden .modal': function(){ this.switchToHome();},
    },

    saveShortcut: function(){
      var shortcut = this.$('.shortcut_input:last').val().trim();
      var replacer = this.$('.replace_input:last').val().trim();
      if( shortcut !== "" && replacer !== "" ){
        this.addUserShortcut(shortcut,replacer);
        this.addInputRow();
      }
    },

    openModal: function(){
      this.switchTo('add_shortcut_modal');
      this.$('#add_shortcut_modal').modal('toggle');
      this.addInputRow(); //Adds the first input row to the form.
    },

    openListModal: function(){
      this.switchTo('list_modal', { shortcuts: this.user_shortcuts });
      this.$('#list_modal').modal('toggle');
    },

    deleteShortcut: function(e){
      var key_for_deletion = this.$(e.target).data('key');
      this.user_shortcuts = _.omit(this.user_shortcuts, key_for_deletion);
      this.$(e.target).closest('tr').remove();
      this.updateApp();
    },

    appInit: function(){
      this.shortcuts = JSON.parse(this.setting('shortcuts'));
      this.user_shortcuts = this.fetchUserShortcuts();
      this.switchToHome();
    },

    checkText: _.debounce( function() {
      if( !this.appEnabled() ){ return; }
      var shared = this.shortcuts['shared'];
      var userShortcuts = this.user_shortcuts;
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
      this.user_shortcuts[shortcut] = replace;
      this.updateApp();
    },

    updateApp: function(){
      this.store('txtr_app_user_shortcuts', this.user_shortcuts);
    },

    addInputRow: function(){
      this.$('#shortcut_form').append(this.renderTemplate('input_row'));
      //Requests focus to the last added row
      this.$('.shortcut_input:last').focus();
    },

    enterKeyPressed: function(e){
      var ENTER_KEYCODE = 13;
      if(e.which == ENTER_KEYCODE){
        this.saveShortcut();
      }
    },

    toggleOnOff: function(){
      if( this.appEnabled() ){
        this.store('app_on', false);
        this.$('#on_off_switch').removeClass('active').text(this.I18n.t('label.disabled'));
      }
      else{
        this.store('app_on', true);
        this.$('#on_off_switch').addClass('active').text(this.I18n.t('label.enabled'));
      }
    },

    switchToHome: function(){
      this.switchTo('home');
      this.initializeOnOffButton();
    },

    appEnabled: function(){
      return this.store('app_on') == true;
    },

    initializeOnOffButton: function(){
      var appState = this.appEnabled() ? this.I18n.t('label.enabled') : this.I18n.t('label.disabled');
      this.$('#on_off_switch').text(appState);
    },

    fetchUserShortcuts: function(){
      var user_shortcuts = this.store('txtr_app_user_shortcuts');
      user_shortcuts = (user_shortcuts == null ? JSON.parse("{}") : user_shortcuts);
      return user_shortcuts;
    }

  };

}());
