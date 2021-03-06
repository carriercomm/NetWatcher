<?php
/**
 * Controller class of the captures
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
 * capturesController class.
 * Manages the captures available
 */
class capturesController extends Common\appController
{

    /**
     * Default inherited constructor for the capturesController class
     *
     * @param CapturesModel $model
     *            Data model of the Captures page
     * @param CapturesView $view
     *            View representation of the Captures page
     */
    public function __construct(CapturesModel $model, CapturesView $view)
    {
        parent::__construct($model, $view);
    }
}
?>