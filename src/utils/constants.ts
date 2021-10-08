export const DEFAULT_TEXT = `func a() does
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
  g()
  c()
end

func g() does
  perform G_ACTION
  g()
end

func main() does
  perform HELLO_WORLD

  a()

  if x == true then
  	b()
    c()
  end
  
  d()
  e()
end
  `;

export const ENTRY_POINT = "main";
export const STATEMENT_END = "end";
