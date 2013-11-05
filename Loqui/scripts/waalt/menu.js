'use strict';

var Menu = {

  // Tells what menu to open
  map: {
    providers: function () {
      if (!$('section#providers ul li').length) {
        Providers.list();
      }
      Lungo.Router.section('providers');
    },
    main: function () {
      Accounts.aside();
      Accounts.main();
      var last = App.accounts.length - 1;
      App.accounts[last || 0].show();
      Lungo.Router.section('main');
    },
    settings: function () {
      Lungo.Router.section('settings');
    },
    me: function () {
      Lungo.Router.section('me');
    },
    contact: function () {
      Messenger.contactProfile();
    },
    contactAdd: function (obj) {
      var account = Messenger.account();
      var selfDomain = Strophe.getDomainFromJid(account.core.user);
      var placeholder = _('User').toLowerCase() + '@' + selfDomain;
      $('section#contactAdd').find('[name=address]').attr('placeholder', placeholder);
      Lungo.Router.section('contactAdd');
    },
    contactRemove: function(obj) {
      var jid = $(obj).closest('section').data('jid');
      Messenger.contactRemove(jid);
    },
    chatRemove: function(obj) {
      var jid = $(obj).closest('section').data('jid');
      Messenger.chatRemove(jid);
    },
    accountRemove: function(obj) {
      var jid = $(obj).closest('section').data('jid');
      Messenger.accountRemove(jid);
    },
    emoji: function () {
      $('section#chat nav#plus').removeClass('show');
      Lungo.Router.article('chat', 'emoji');
    },
    powerOff: function () {
      var will = confirm(_('ConfirmClose'));
      if (will) {
        Lungo.Notification.success(_('Closing'), _('AppWillClose'), 'signout', 3);
        var req = navigator.mozAlarms.getAll();
        req.onsuccess = function () {
          this.result.forEach(function (alarm) {
            navigator.mozAlarms.remove(alarm.id);
          });
          App.killAll();
          setTimeout(function () {
            console.log(App.name + ' has been closed');
            window.close();
          }, 3000);
        }
        req.onerror = function () { }
      }
    }
  },
  
  // Opens a certain menu
  show: function (which, attr, delay) {
    var map = this.map;
    setTimeout(function () { map[which](attr); }, delay );
  }
  
}
