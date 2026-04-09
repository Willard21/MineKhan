(module
  (type (;0;) (func (param f64 f64 f64) (result f64)))
  (type (;1;) (func (param i32 i32) (result i32)))
  (func (;0;) (type 0) (param f64 f64 f64) (result f64)
    (local f64 f64 f64 f64 f64 f64 i32 f64 i32 i32 i32 i32 i32 i32 f64 f64)
    local.get 0
    local.get 1
    f64.add
    local.get 2
    f64.add
    f64.const -0x1.5555555555555p-3 (;=-0.166667;)
    f64.mul
    local.tee 3
    local.get 0
    f64.add
    local.tee 4
    local.get 4
    f64.floor
    local.tee 5
    f64.sub
    local.tee 4
    local.get 3
    local.get 1
    f64.add
    local.tee 6
    local.get 6
    f64.floor
    local.tee 7
    f64.sub
    local.tee 6
    f64.sub
    f64.const 0x1p+0 (;=1;)
    f64.add
    local.set 8
    local.get 8
    i32.trunc_f64_s
    local.set 9
    local.get 6
    local.get 3
    local.get 2
    f64.add
    local.tee 3
    local.get 3
    f64.floor
    local.tee 10
    f64.sub
    local.tee 8
    f64.sub
    f64.const 0x1p+0 (;=1;)
    f64.add
    local.set 3
    local.get 3
    i32.trunc_f64_s
    local.set 11
    local.get 4
    local.get 8
    f64.sub
    f64.const 0x1p+0 (;=1;)
    f64.add
    local.set 3
    local.get 3
    i32.trunc_f64_s
    local.set 12
    local.get 8
    local.get 4
    local.get 6
    f64.add
    f64.add
    local.set 3
    local.get 3
    i32.trunc_f64_s
    local.set 13
    local.get 8
    local.get 3
    f64.add
    local.set 8
    local.get 8
    i32.trunc_f64_s
    local.set 14
    local.get 6
    local.get 3
    f64.add
    local.set 6
    local.get 6
    i32.trunc_f64_s
    local.set 15
    local.get 4
    local.get 3
    f64.add
    local.set 3
    local.get 3
    i32.trunc_f64_s
    local.set 16
    block  ;; label = @1
      i32.const 0
      i32.load offset=1024
      local.get 9
      i32.const 1
      i32.shl
      local.get 11
      i32.or
      local.get 12
      i32.const 2
      i32.shl
      i32.or
      local.get 13
      i32.const 3
      i32.shl
      i32.or
      local.get 14
      i32.const 5
      i32.shl
      i32.or
      local.get 15
      i32.const 7
      i32.shl
      i32.or
      local.get 16
      i32.const 9
      i32.shl
      i32.or
      i32.const -47232093
      i32.mul
      i32.const 1013904223
      i32.add
      i32.const 1
      i32.shr_u
      i32.const 80
      i32.rem_u
      i32.const 2
      i32.shl
      i32.add
      i32.load
      local.tee 9
      i32.const -1
      i32.ne
      br_if 0 (;@1;)
      f64.const 0x0p+0 (;=0;)
      return
    end
    i32.const 6
    i32.const 8
    local.get 9
    i32.const 432
    i32.lt_s
    select
    local.set 11
    local.get 9
    i32.const 3
    i32.shl
    i32.const 320
    i32.add
    local.set 9
    local.get 2
    local.get 10
    local.get 10
    local.get 5
    local.get 7
    f64.add
    f64.add
    f64.const 0x1.5555555555555p-2 (;=0.333333;)
    f64.mul
    local.tee 3
    f64.add
    f64.sub
    local.set 2
    local.get 1
    local.get 7
    local.get 3
    f64.add
    f64.sub
    local.set 17
    local.get 0
    local.get 5
    local.get 3
    f64.add
    f64.sub
    local.set 0
    f64.const 0x0p+0 (;=0;)
    local.set 1
    loop  ;; label = @1
      block  ;; label = @2
        f64.const 0x1p+1 (;=2;)
        local.get 0
        local.get 9
        f64.load
        f64.add
        local.tee 3
        local.get 3
        f64.mul
        f64.sub
        local.get 17
        local.get 9
        i32.const 8
        i32.add
        f64.load
        f64.add
        local.tee 4
        local.get 4
        f64.mul
        f64.sub
        local.get 2
        local.get 9
        i32.const 16
        i32.add
        f64.load
        f64.add
        local.tee 6
        local.get 6
        f64.mul
        f64.sub
        local.tee 8
        f64.const 0x0p+0 (;=0;)
        f64.gt
        i32.eqz
        br_if 0 (;@2;)
        local.get 7
        local.get 9
        i32.const 32
        i32.add
        f64.load
        f64.add
        local.set 18
        local.get 18
        i32.trunc_f64_s
        local.set 12
        local.get 5
        local.get 9
        i32.const 24
        i32.add
        f64.load
        f64.add
        local.set 18
        local.get 18
        i32.trunc_f64_s
        local.set 13
        local.get 10
        local.get 9
        i32.const 40
        i32.add
        f64.load
        f64.add
        local.set 18
        local.get 18
        i32.trunc_f64_s
        local.set 14
        local.get 8
        local.get 8
        f64.mul
        local.tee 8
        local.get 8
        f64.mul
        local.get 13
        i32.const 255
        i32.and
        i32.const 8640
        i32.add
        i32.load8_u
        local.get 12
        i32.add
        local.get 14
        i32.add
        i32.const 255
        i32.and
        i32.const 8896
        i32.add
        i32.load8_s
        local.tee 12
        i32.const 9154
        i32.add
        i32.load8_s
        f64.convert_i32_s
        local.get 6
        f64.mul
        local.get 12
        i32.const 9152
        i32.add
        i32.load8_s
        f64.convert_i32_s
        local.get 3
        f64.mul
        local.get 4
        local.get 12
        i32.const 9153
        i32.add
        i32.load8_s
        f64.convert_i32_s
        f64.mul
        f64.add
        f64.add
        f64.mul
        local.get 1
        f64.add
        local.set 1
      end
      local.get 9
      i32.const 48
      i32.add
      local.set 9
      local.get 11
      i32.const -1
      i32.add
      local.tee 11
      br_if 0 (;@1;)
    end
    local.get 1
    f64.const 0x1.3e22cbce4a902p-8 (;=0.00485437;)
    f64.mul
    f64.const 0x1p-1 (;=0.5;)
    f64.add)
  (func (;1;) (type 1) (param i32 i32) (result i32)
    (local i32 i32 f64 f64 i32 f64 i32)
    i32.const 9224
    i32.const 0
    i32.const 20992
    memory.fill
    i32.const 1024
    local.set 2
    loop  ;; label = @1
      block  ;; label = @2
        f64.const 0x1p-1 (;=0.5;)
        local.get 2
        i32.const 4
        i32.shr_u
        i32.const 15
        i32.and
        local.tee 3
        local.get 0
        i32.add
        f64.convert_i32_s
        f64.const 0x1.47ae147ae147bp-6 (;=0.02;)
        f64.mul
        local.tee 4
        local.get 2
        i32.const 8
        i32.shr_u
        f64.convert_i32_s
        f64.const 0x1.47ae147ae147bp-6 (;=0.02;)
        f64.mul
        local.tee 5
        local.get 2
        i32.const 15
        i32.and
        local.tee 6
        local.get 1
        i32.add
        f64.convert_i32_s
        f64.const 0x1.47ae147ae147bp-6 (;=0.02;)
        f64.mul
        local.tee 7
        call 0
        f64.sub
        f64.abs
        f64.const 0x1.6872b020c49bap-8 (;=0.0055;)
        f64.lt
        i32.eqz
        br_if 0 (;@2;)
        f64.const 0x1p-1 (;=0.5;)
        local.get 5
        local.get 7
        local.get 4
        call 0
        f64.sub
        f64.abs
        f64.const 0x1.6872b020c49bap-8 (;=0.0055;)
        f64.lt
        i32.eqz
        br_if 0 (;@2;)
        local.get 2
        i32.const 9224
        i32.add
        local.set 8
        block  ;; label = @3
          local.get 6
          i32.const -2
          i32.add
          i32.const 11
          i32.gt_u
          br_if 0 (;@3;)
          local.get 3
          i32.const -2
          i32.add
          i32.const 11
          i32.gt_u
          br_if 0 (;@3;)
          i32.const 0
          local.set 6
          loop  ;; label = @4
            block  ;; label = @5
              local.get 8
              local.get 6
              i32.const 30216
              i32.add
              i32.load16_s
              i32.add
              local.tee 3
              i32.load8_u
              i32.const 1
              i32.eq
              br_if 0 (;@5;)
              local.get 3
              i32.const 2
              i32.store8
            end
            block  ;; label = @5
              local.get 8
              local.get 6
              i32.const 30218
              i32.add
              i32.load16_s
              i32.add
              local.tee 3
              i32.load8_u
              i32.const 1
              i32.eq
              br_if 0 (;@5;)
              local.get 3
              i32.const 2
              i32.store8
            end
            block  ;; label = @5
              local.get 8
              local.get 6
              i32.const 30220
              i32.add
              i32.load16_s
              i32.add
              local.tee 3
              i32.load8_u
              i32.const 1
              i32.eq
              br_if 0 (;@5;)
              local.get 3
              i32.const 2
              i32.store8
            end
            local.get 6
            i32.const 6
            i32.add
            local.tee 6
            i32.const 162
            i32.ne
            br_if 0 (;@4;)
            br 2 (;@2;)
          end
        end
        local.get 8
        i32.const 1
        i32.store8
      end
      local.get 2
      i32.const 1
      i32.add
      local.tee 2
      i32.const 20480
      i32.ne
      br_if 0 (;@1;)
    end
    i32.const 9224)
  (memory (;0;) 2)
  (global (;0;) (mut i32) (i32.const 66576))
  (export "memory" (memory 0))
  (export "getCaves" (func 1)))
