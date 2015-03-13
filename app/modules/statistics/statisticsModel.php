<?php
/**
 * Model class of the statistics
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
 * statisticsModel class.
 */
class statisticsModel extends Common\appModel
{

    /**
     * Constructor for the statistics model
     */
    public function __construct()
    {
        parent::__construct();
        /* Additional libraries */
        array_push($this->jsLibraries, 'netwatcher-statistics.js.php');
    }
}
?>