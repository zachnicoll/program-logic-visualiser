# Program Logic Visualiser

Visualisation application for analysing the control flow of arbitrary, procedural source code.

## Quickstart

```sh
yarn
yarn start
```

## Syntax

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
