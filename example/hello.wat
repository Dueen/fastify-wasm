(module
  ;; Import the host logging function from the "env" namespace.
  (import "env" "log" (func $log (param i32 i32)))
  
  ;; Export one page (64KiB) of memory.
  (memory (export "memory") 1)

  ;; Store the string "Hello from WebAssembly!" at offset 0 in memory.
  (data (i32.const 0) "Hello from WebAssembly!")
  
  ;; Exported function "hello" that calls the imported "log" function.
  (func $hello (export "hello")
    ;; Pass the pointer (0) and length (23) to log.
    (call $log (i32.const 0) (i32.const 23))
  )
)