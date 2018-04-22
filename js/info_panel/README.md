# InfoPanel Module Guideline

## Module Dependency


## Module structure

`InfoPanel` as well as its submodules have the following methods
  1. `reset()`: reset component (`div`) to the default state
  2. `update()`: update content of module based on data input, data is usually an object
  3. `show()`: display, calls `$().show()` method
  4. `hide()`: hide, calls `$().hide()` method
  5. `resize()`: <TODO>, resize based on bounding element's size. ``

## Instantiation Procedure

When `InfoPanel` is instantiated by calling `var infoPanel = new InfoPanel(div_id)`, the following calls are fired:
  1. `InfoPanel.reset()`: reset div to having default HTML structure
  2. instantiation of each of the subcomponents, where each subcomponents goes through their `reset()` method to set up HTML structure.

After the InfoPanel is instantiated, the user needs to call `infoPanel.update(data)` to populate the data. 
  * <TODO> We should have all modules hidden until `infoPanel.update()` returns

The calls should have the following hierarchy:
  1. `var infoPanel = new InfoPanel(div_id)`
    1. `InfoPanel.reset()`
    2. `new Component1()`
      1. `component1.reset()`
    3. `new Component2()`
      1. `component2.reset()`
  2. `infoPanel.update(data)`
    1. `component1.update(data.part1)`
    2. `component1.update(data.part2)`
    3. `infoPanel.show()`
    4. `infoPanel.resize()`
       1. `component1.resize()`
       2. `component2.resize()`
   
