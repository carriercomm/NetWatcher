<?php
/**
 * Model class of the storage
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
 * storageModel class.
 */
class storageModel extends Common\appModel
{

    /**
     * Constructor for the storage model
     */
    public function __construct()
    {
        parent::__construct();
        /* Additional libraries */
        array_push($this->jsLibraries, 'Chart.min.js', 'netwatcher-utils.js', 'netwatcher-storage.js.php');
    }
}
?>