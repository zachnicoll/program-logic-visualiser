# Program Logic Visualiser

Visualisation application for analysing the control flow of arbitrary, procedural source code.

## Quickstart

```sh
yarn
yarn start
```

## Visualisation Examples

### Function Call Graph

*Function main() calls function a()*

[Function main() calls function a()](content/example1.png)

*Function main() conditionally calls function a()*

[Function main() conditionally calls function a()](content/example2.png)

*Function a() calls itself*

[Function a() calls itself](content/example3.png)

*Complex example*

[A complex example](content/complex_graph.png)
### Logic Flow Diagram

*Action A_ACTION is performed inside a function*

[A_ACTION is performed inside a function](content/example5.png)

*Decision node determining the flow of execution*

[Decision node determining the flow of execution](content/example6.png)

*Complex example*

[A complex example](content/complex_logic.png)

## User Guide

You can create your own visualisations by entering pseudocode (see syntax below) into the code pane on the left side of the screen, and clicking the "Generate Visualisation" button at the top of the screen.

This produces the "Function Call Graph" associated with the pseudo-program. This visualisation represents each function, and how each function is called. 
- Conditional function calls are represented with dotted edges
- Recursive function calls are represented with red edges

Hover your mouse pointer over conditional edges to display the condition that must be met in order for the function to be called.

[Hover over a conditional edge to reveal the condition](content/example4.png)

Clicking on any of the nodes in the graph will produce the "Logic Flow Diagram" for that function. This visualisation represents the inner logic and conditions associated with the execution flow of the function.
- START and STOP represent the beginning and end of execution flow within the function
- Yellow squares represent arbitrary "actions" e.g. `perform SOME_ACTION`
- Purple diamonds represent "decisions" (if-statements)
- White circles with green outlines represent other function calls

In the Logic Flow Diagram, the box in the top right corner of the screen shows all of the local variables inside that function. Changing the values and clicking "re-evaluate" with regenerate the diagram considering these new values.

[Dynamic parameter manipulation](content/params.png)

## Pseudocode Syntax

_Functions_

```
func a() does
	return 1
end

func main() does
	a()
end
```

_Variables_

```
let x = 10
let y = "hello"
```

_Logic_

```
if x == true then

end

== // equal
!= // does not equal
```

_Loops_

```
for i from 1 to 100 do

end

while i != true do

end
```

_Comments_

```
// This is a comment
```

_Altogether_

```
func a() does
	perform A_ACTION // Actions are arbitrary and represent code out of the scope of this tool
	return 10
end

func b(x) does
	if x == 10 then
		perform B_ACTION
	end
end

func main() does
	let x = a()

	if x == 10 then
		b(x)
	end

	for i from 1 to 100 do
		perform LOOP_ACTION
	end
end
```
