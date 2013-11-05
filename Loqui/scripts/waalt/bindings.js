'use strict';

if (navigator.mozAlarms) {
  navigator.mozSetMessageHandler("alarm", function (message) {
    App.alarmSet(message.data);
  });
}

$('document').ready(function(){
  setTimeout(function(){
    $('[data-l10n-title]').each(function () {
      $(this).attr('data-title', _(this.dataset.l10nTitle));
      $(this).find('h1').text(_(this.dataset.l10nTitle));
    });
    $('input[data-l10n-placeholder]').each(function () {
      var original = $(this).data('l10n-placeholder');
      var local = _(original);
      $(this).attr('placeholder', local);
    });
    App.defaults.Connector.presence.status = _('DefaultStatus', {
      app: App.name,
      platform: (Lungo.Core.environment().os ? Lungo.Core.environment().os.name : 'PC')
    })
  });
});

// Reconnect on new WiFi / 3G connection
document.body.addEventListener('online', function () {
  console.log('ONLINE AGAIN');
  App.online = true;
  App.connect();
}, false);

// Go to offline mode
document.body.addEventListener('offline', function () {
  console.log('OFFLINE');
  App.online = false;
  App.disconnect();
}, false);

// Close connections before quit
$(window).on('beforeunload', function () {
  App.killAll();
});

// Go "away" when app is hidden
document.addEventListener("visibilitychange", function() {
  for (var i in App.accounts) {
    var account = App.accounts[i];
    if (document.hidden) {
      account.connector.presenceSend('away');
    } else {
      account.connector.presenceSend();
    }
  }
});

// Type in chat text box
$('section#chat article#main div#text').on('keydown', function (e) {
  if (e.which == 13) {
    e.preventDefault();
    Messenger.say();
    Messenger.csn('active');
  } else if (e.which == 8 || e.which == 46) {
    if (this.textContent.length < 2) {
      $('section#chat article#main button#plus').show();
      $('section#chat article#main button#say').hide();
      Messenger.csn('paused');
    }
  } else {
    $('section#chat article#main button#plus').hide();
    $('section#chat article#main button#say').show();
    var ul = $('section#chat ul#messages');
    ul[0].scrollTop = ul[0].scrollHeight;
    if ($(this).text().length == 0) {
      Messenger.csn('composing');
    }
  }
}).on('tap', function (e) {
  $('section#chat nav#plus').removeClass('show');
  var ul = $('section#chat ul#messages');
  ul[0].scrollTop = ul[0].scrollHeight + 500;
});

// Tap my avatar
$('section#me #card span.avatar').on('click', function (e) {
  if (typeof MozActivity != 'undefined') {
    var pick = new MozActivity({
      name: 'pick',
      data: {
        type: ['image/png', 'image/jpg', 'image/jpeg']
      }
    });
    pick.onsuccess = function() {
      var image = this.result;
      Messenger.avatarSet(image.blob);
    }
    pick.onerror = function() { }
  } else {
    Lungo.Notification.error(_('NoDevice'), _('FxOSisBetter', 'exclamation-sign'));
  }
});

$('section#me #status input').on('blur', function (e) {
  Messenger.presenceUpdate();
}).on('keydown', function (e) {
  if (e.which == 13) {
    e.preventDefault();
    Messenger.presenceUpdate();
  }
});

$('[data-var]').each(function () {
  var key = $(this).data('var');
  var value = App[key];
  $(this).text(value);
});

if (navigator.mozAlarms) {
  navigator.mozSetMessageHandler("alarm", function (message) {
    App.alarmSet(message.data);
  });
}

Strophe.Connection.rawInput = function (data) {
  console.log(data);
};

Strophe.Connection.rawOutput = function (data) {
  console.log(data);
};
