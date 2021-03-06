<?php
/**
 * Model class of the settings
 *
 * Inherits from appModel class
 *
 * @package App
 */

/**
 * App namespace (user defined behaviour)
 */
namespace App;

/**
 * settingsModel class.
 * Stores the settings
 */
class settingsModel extends Common\appModel
{

    /**
     * Constructor for the settings model
     */
    public function __construct()
    {
        parent::__construct();
        /* Additional libraries (IP Checker) */
        array_push($this->jsLibraries, 'netwatcher-settings.js');
    }

    /**
     * Saves the dynamic settings to a file
     *
     * @param array $settings
     *            Array containing the new settings
     * @return boolean TRUE if success saving the settings, FALSE otherwise
     */
    public function saveSettings(Array $settings)
    {
        /* Loads the configuration file */
        return file_put_contents(DEFAULT_CONFIG_FILE, json_encode($settings)) !== FALSE;
    }
}
?>