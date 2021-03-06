angular
  .module('material.components.chips')
  .directive('mdContactChips', MdContactChips);

/**
 * @ngdoc directive
 * @name mdContactChips
 * @module material.components.chips
 *
 * @description
 * `<md-contact-chips>` is an input component based on `md-chips` and makes use of an
 * `md-autocomplete` element. The component allows the caller to supply a query expression which
 * returns  a list of possible contacts. The user can select one of these and add it to the list of
 * chips.
 *
 * You may also use the <a ng-href="api/directive/mdHighlightText">md-highlight-flags</a> attribute
 * along with its parameters to control the appearance of the matched text inside of the contacts'
 * autocomplete popup.
 *
 * @param {expression} ng-model Assignable AngularJS expression to be data-bound to the list of
 *    contact chips. The expression should evaluate to an `Object` Array.
 * @param {expression=} ng-change AngularJS expression to be executed on chip addition, removal,
 *    or content change.
 * @param {string=} placeholder Placeholder text that will be forwarded to the input.
 * @param {string=} secondary-placeholder Placeholder text that will be forwarded to the input,
 *    displayed when there is at least on item in the list
 * @param {expression} md-contacts An expression expected to return contacts matching the search
 *    test, `$query`. If this expression involves a promise, a loading bar is displayed while
 *    waiting for it to resolve.
 * @param {string} md-contact-name The field name of the contact object representing the
 *    contact's name.
 * @param {string} md-contact-email The field name of the contact object representing the
 *    contact's email address.
 * @param {string} md-contact-image The field name of the contact object representing the
 *    contact's image.
 * @param {number=} md-min-length Specifies the minimum length of text before autocomplete will
 *    make suggestions
 * @param {string=} input-aria-describedby A space-separated list of element IDs. This should
 *     contain the IDs of any elements that describe this autocomplete. Screen readers will read
 *     the content of these elements at the end of announcing that the chips input has been
 *     selected and describing its current state. The descriptive elements do not need to be
 *     visible on the page.
 * @param {string=} input-aria-labelledby A space-separated list of element IDs. The ideal use
 *    case is that this would contain the ID of a `<label>` element that is associated with these
 *    chips.<br><br>
 *    For `<label id="state">US State</label>`, you would set this to
 *    `input-aria-labelledby="state"`.
 * @param {string=} input-aria-label A string read by screen readers to identify the input.
 *    For static chips, this will be applied to the chips container.
 * @param {string=} container-hint A string read by screen readers informing users of how to
 *    navigate the chips when there are chips.
 * @param {string=} container-empty-hint A string read by screen readers informing users of how to
 *    add chips when there are no chips. You will want to use this to override the default when
 *    in a non-English locale.
 * @param {string=} delete-hint A string read by screen readers instructing users that pressing
 *    the delete key will remove the chip. You will want to use this to override the default when
 *    in a non-English locale.
 * @param {string=} md-removed-message Screen readers will announce this message following the
 *    chips contents. The default is `"removed"`. If a chip with the content of "Apple" was
 *    removed, the screen reader would read "Apple removed". You will want to use this to override
 *    the default when in a non-English locale.
 *
 *
 * @usage
 * <hljs lang="html">
 *   <md-contact-chips
 *       ng-model="ctrl.contacts"
 *       md-contacts="ctrl.querySearch($query)"
 *       md-contact-name="name"
 *       md-contact-image="image"
 *       md-contact-email="email"
 *       placeholder="To">
 *   </md-contact-chips>
 * </hljs>
 *
 */


var MD_CONTACT_CHIPS_TEMPLATE = '\
      <md-chips class="md-contact-chips"\
          ng-model="$mdContactChipsCtrl.contacts"\
          ng-change="$mdContactChipsCtrl.ngChange($mdContactChipsCtrl.contacts)"\
          md-require-match="$mdContactChipsCtrl.requireMatch"\
          md-chip-append-delay="{{$mdContactChipsCtrl.chipAppendDelay}}"\
          md-separator-keys="$mdContactChipsCtrl.separatorKeys"\
          md-autocomplete-snap>\
          <md-autocomplete\
              md-menu-class="md-contact-chips-suggestions"\
              md-selected-item="$mdContactChipsCtrl.selectedItem"\
              md-search-text="$mdContactChipsCtrl.searchText"\
              md-items="item in $mdContactChipsCtrl.queryContact($mdContactChipsCtrl.searchText)"\
              md-item-text="$mdContactChipsCtrl.itemName(item)"\
              md-no-cache="true"\
              md-min-length="$mdContactChipsCtrl.minLength"\
              md-autoselect\
              ng-keydown="$mdContactChipsCtrl.inputKeydown($event)"\
              placeholder="{{$mdContactChipsCtrl.contacts.length === 0 ?\
                  $mdContactChipsCtrl.placeholder : $mdContactChipsCtrl.secondaryPlaceholder}}">\
            <div class="md-contact-suggestion">\
              <img \
                  ng-src="{{item[$mdContactChipsCtrl.contactImage]}}"\
                  alt="{{item[$mdContactChipsCtrl.contactName]}}"\
                  ng-if="item[$mdContactChipsCtrl.contactImage]" />\
              <span class="md-contact-name" md-highlight-text="$mdContactChipsCtrl.searchText"\
                    md-highlight-flags="{{$mdContactChipsCtrl.highlightFlags}}">\
                {{item[$mdContactChipsCtrl.contactName]}}\
              </span>\
              <span class="md-contact-email" >{{item[$mdContactChipsCtrl.contactEmail]}}</span>\
            </div>\
          </md-autocomplete>\
          <md-chip-template>\
            <div class="md-contact-avatar">\
              <img \
                  ng-src="{{$chip[$mdContactChipsCtrl.contactImage]}}"\
                  alt="{{$chip[$mdContactChipsCtrl.contactName]}}"\
                  ng-if="$chip[$mdContactChipsCtrl.contactImage]" />\
            </div>\
            <div class="md-contact-name">\
              {{$chip[$mdContactChipsCtrl.contactName]}}\
            </div>\
          </md-chip-template>\
      </md-chips>';


/**
 * MDContactChips Directive Definition
 *
 * @param $mdTheming
 * @param $mdUtil
 * @returns {*}
 * @ngInject
 */
function MdContactChips($mdTheming, $mdUtil) {
  return {
    template: function(element, attrs) {
      return MD_CONTACT_CHIPS_TEMPLATE;
    },
    restrict: 'E',
    controller: 'MdContactChipsCtrl',
    controllerAs: '$mdContactChipsCtrl',
    bindToController: true,
    compile: compile,
    scope: {
      contactQuery: '&mdContacts',
      placeholder: '@?',
      secondaryPlaceholder: '@?',
      contactName: '@mdContactName',
      contactImage: '@mdContactImage',
      contactEmail: '@mdContactEmail',
      contacts: '=ngModel',
      ngChange: '&?',
      requireMatch: '=?mdRequireMatch',
      minLength: '=?mdMinLength',
      highlightFlags: '@?mdHighlightFlags',
      chipAppendDelay: '@?mdChipAppendDelay',
      separatorKeys: '=?mdSeparatorKeys',
      removedMessage: '@?mdRemovedMessage',
      inputAriaDescribedBy: '@?inputAriaDescribedby',
      inputAriaLabelledBy: '@?inputAriaLabelledby',
      inputAriaLabel: '@?',
      containerHint: '@?',
      containerEmptyHint: '@?',
      deleteHint: '@?'
    }
  };

  function compile(element, attr) {
    return function postLink(scope, element, attrs, controllers) {
      var contactChipsController = controllers;

      $mdUtil.initOptionalProperties(scope, attr);
      $mdTheming(element);

      element.attr('tabindex', '-1');

      attrs.$observe('mdChipAppendDelay', function(newValue) {
        contactChipsController.chipAppendDelay = newValue;
      });
    };
  }
}
