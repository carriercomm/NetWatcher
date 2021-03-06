<?php
/**
 * Controller class of the storage
 *
 * Inherits from appController class
 *
 * @package App
 */

/**
 * App namespace (user defined behaviour)
 */
namespace App;

/**
 * storageController class
 * Displays different storage statistics as disk usage
 */
class storageController extends Common\appController
{

    /**
     * Default inherited constructor for the storageController class
     *
     * @param StorageModel $model
     *            Data model of the Storage page
     * @param StorageView $view
     *            View representation of the Storage page
     */
    public function __construct(StorageModel $model, StorageView $view)
    {
        parent::__construct($model, $view);
    }
}
?>