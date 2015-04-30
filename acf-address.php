<?php

/**
 * Plugin Name:  Advanced Custom Fields: Address
 * Plugin URI:   https://github.com/mcaskill/acf-field-address
 * Description:  ACF Field for the components of a geographical address
 * Version:      2.0.0
 *
 * Author:       Chauncey McAskill</a>, <a href="https://github.com/strickdj/acf-field-address">Daris Strickland
 * Author URI:   https://mcaskill.ca
 *
 * License:      GPLv2 or later
 * License URI:  http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Text Domain:  acf-address
 * Domain Path:  /assets/languages
 */

/**
 * Some pre-processed useful variables.
 */

$plugin = wp_normalize_path( basename( __DIR__ ) );
$mu_plugin_dir = wp_normalize_path( WPMU_PLUGIN_DIR );

/**
 * Action: Register the plugin's text domain
 *
 * @uses Action: "muplugins_loaded"
 * @uses Action: "plugins_loaded"
 */

if ( ! empty( $plugin ) && 0 === strpos( $plugin, $mu_plugin_dir ) ) {
	add_action( 'muplugins_loaded', function() use ( $plugin ) {
		load_muplugin_textdomain( 'acf-address', $plugin . 'assets/languages' );
	} );
}
else {
	add_action( 'plugins_loaded', function() use ( $plugin ) {
		load_plugin_textdomain( 'acf-address', false, $plugin . 'assets/languages' );
	} );
}

/**
 * Action: Load field for ACF V5+
 */

add_action( 'acf/include_field_types', function ( $version ) {
	include_once('acf-address-v5.php');
} );

/**
 * Action: Load field for ACF V4
 */

add_action( 'acf/register_fields', function () {
	include_once('acf-address-v4.php');
} );
