# ACF Address Field

Adds a "Address" field type for the [Advanced Custom Fields](http://advancedcustomfields.com) WordPress plugin.

---------------------------------------

## Overview

The _Address_ field provides the ability to enter a geographical address by its components (street, municipality, postal code, country,...), enable or disable components, and change the layout of the entered address (from the field group edit page) and the printed address (get_field() value).

This field is a fork of:
- [Daris Strickland's ACF Address Field](https://github.com/strickdj/acf-field-address)

This field is based on:
- [GCX's ACF Address Field](https://github.com/GCX/acf-address-field)

## Compatibility

This ACF field type is compatible with:

* ACF 5
* ~~ACF 4~~
* ~~ACF 3~~

## Installation

1. Copy the `acf-address` folder into your `wp-content/plugins` or `wp-content/mu-plugins` directory (Composer installation coming soon).
2. Activate the "Advanced Custom Fields: Address" plugin via the plugins admin page.
3. Create a new field via ACF and select the "Address" type.
4. Please refer to the description for more info regarding the field type settings.

## Structure

* `/assets/styles`:  folder for `.css` files.
* `/assets/images`: folder for image files.
* `/assets/js`: folder for `.js` files.
* `/assets/languages`: folder for `.pot`, `.po` and `.mo` files.
* `acf-address.php`: Main plugin file that includes the correct field file based on the ACF version.
* `acf-address-v5.php`: Field class compatible with ACF version 5.
* `acf-address-v4.php`: Field class compatible with ACF version 4.
* `README.md`: WordPress readme file to be used by the wordpress repository.

## Changelog

2.0.0 - Initial fork, refactor, and fix.
