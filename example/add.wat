(module
  ;; Exported function "add" that takes two 32-bit integers and returns their sum.
  (func (export "add") (param $lhs i32) (param $rhs i32) (result i32)
    local.get $lhs
    local.get $rhs
    i32.add
  )
)