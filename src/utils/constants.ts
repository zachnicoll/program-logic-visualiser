export const DEFAULT_TEXT = `
func a() does
  perform A_ACTION
end

func b() does
  perform B_ACTION
end

func c() does
  perform C_ACTION
  d()
end

func d() does
  perform D_ACTION
	e()
	f()
	g()
end

func e() does
  perform E_ACTION
end

func f() does
  perform F_ACTION
end

func g() does
  perform G_ACTION
end

func main() does
  perform HELLO_WORLD

  if x == true then
  	e()
  end

  a()
  b()
  c()
  d()
end
  `;

export const ENTRY_POINT = "main";
export const STATEMENT_END = "end";
