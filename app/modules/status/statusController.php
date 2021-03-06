<?php
/**
 * Controller class of the status
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
 * statusController class.
 * Runs a batch of tests to see if all the components are working
 */
class statusController extends Common\appController
{

    /**
     * Default inherited constructor for the statusController class
     *
     * @param StatusModel $model
     *            Data model of the Status page
     * @param StatusView $view
     *            View representation of the Status page
     */
    public function __construct(StatusModel $model, StatusView $view)
    {
        parent::__construct($model, $view);
    }

    /**
     * Overwrites the parent display and runs the tests first
     *
     * @see \App\Common\Controllers\appController::display()
     *
     * @param array $args
     *            Params of the display
     */
    public function display(Array $args)
    {
        /* Run the tests */
        $this->model->checkAll();
        
        /* Display the results */
        parent::display($args);
    }
}
?>