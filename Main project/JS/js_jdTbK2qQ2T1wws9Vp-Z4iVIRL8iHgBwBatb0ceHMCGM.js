/* @license GNU-GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(function($, Drupal, Bootstrap) {
    Drupal.behaviors.dialog.ajaxCurrentButton = null;
    Drupal.behaviors.dialog.ajaxOriginalButton = null;
    var success = Drupal.Ajax.prototype.success;
    Drupal.Ajax.prototype.success = function(response, status) {
        if (this.dialogType)
            for (var i = 0, l = response.length; i < l; i++)
                if (response[i].dialogOptions) {
                    response[i].dialogType = response[i].dialogOptions.dialogType = this.dialogType;
                    response[i].$trigger = response[i].dialogOptions.$trigger = $(this.element);
                }
        return success.apply(this, [response, status]);
    }
    ;
    var beforeSerialize = Drupal.Ajax.prototype.beforeSerialize;
    Drupal.Ajax.prototype.beforeSerialize = function(element, options) {
        if (this.dialogType) {
            options.data['ajax_page_state[dialogType]'] = this.dialogType;
            var id = $(this.element).parents('.js-drupal-dialog:first').attr('id');
            if (id)
                options.data['ajax_page_state[dialogId]'] = id;
        }
        return beforeSerialize.apply(this, arguments);
    }
    ;
    Drupal.behaviors.dialog.ajaxUpdateButtons = function(reset) {
        if (this.ajaxCurrentButton && this.ajaxOriginalButton) {
            this.ajaxCurrentButton.html(this.ajaxOriginalButton.html() || this.ajaxOriginalButton.attr('value'));
            this.ajaxCurrentButton.prop('disabled', this.ajaxOriginalButton.prop('disabled'));
        }
        if (reset) {
            this.ajaxCurrentButton = null;
            this.ajaxOriginalButton = null;
        }
    }
    ;
    $(document).ajaxSend(function() {
        Drupal.behaviors.dialog.ajaxUpdateButtons();
    }).ajaxComplete(function() {
        Drupal.behaviors.dialog.ajaxUpdateButtons(true);
    });
    Drupal.behaviors.dialog.prepareDialogButtons = function prepareDialogButtons($dialog) {
        var _this = this;
        var buttons = [];
        var $buttons = $dialog.find('.form-actions').find('button, input[type=submit], a.button, .btn');
        $buttons.each(function() {
            var $originalButton = $(this).attr('tabindex', -1).css({
                display: 'block',
                width: 0,
                height: 0,
                padding: 0,
                border: 0,
                overflow: 'hidden'
            });
            buttons.push({
                text: Bootstrap.stripHtml($originalButton) || $originalButton.attr('value'),
                class: $originalButton.attr('class').replace('use-ajax-submit', ''),
                click: function click(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _this.ajaxCurrentButton = $(e.target);
                    _this.ajaxOriginalButton = $originalButton;
                    Bootstrap.simulate($originalButton, ['mousedown', 'mouseup', 'click']);
                },
                create: function() {
                    _this.ajaxCurrentButton = $(this);
                    _this.ajaxOriginalButton = $originalButton;
                    _this.ajaxUpdateButtons(true);
                }
            });
        });
        return buttons;
    }
    ;
}
)(window.jQuery, window.Drupal, window.Drupal.bootstrap);
;