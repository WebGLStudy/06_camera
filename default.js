(function(){
    'use strict';

    // 変数
    var gl, canvas;

    window.addEventListener('load', function(){
        ////////////////////////////
        // 初期化
        ////////////////////////////
        
        // canvas の初期化
        canvas = document.getElementById('canvas');
        canvas.width = 512;
        canvas.height = 512;

        // WeebGLの初期化(WebGL 2.0)
        gl = canvas.getContext('webgl2');

        // シェーダプログラムの初期化
        // 頂点シェーダ
        var vsSource = [
            '#version 300 es',
            'in vec3 position;',
            'in vec3 color;',
            
            'uniform mat4 mwMatrix;',
            'uniform mat4 mpvMatrix;',
            
            'out vec4 vColor;',

            'void main(void) {',
                'gl_Position = mpvMatrix * mwMatrix * vec4(position, 1.0);',
                'vColor = vec4(color, 1.0);',
            '}'
        ].join('\n');

        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vsSource);
        gl.compileShader(vertexShader);
        if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
            alert(gl.getShaderInfoLog(vertexShader));
        }

        // フラグメントシェーダ
        var fsSource = [
            '#version 300 es',
            'precision highp float;',
            
            'in vec4 vColor;',
            
            'out vec4 outColor;',

            'void main(void) {',
                'outColor = vColor;',
            '}'
        ].join('\n');

        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fsSource);
        gl.compileShader(fragmentShader);
        if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
            alert(gl.getShaderInfoLog(fragmentShader));
        }

        // シェーダ「プログラム」の初期化
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            alert(gl.getProgramInfoLog(program));
            return;
        }
        // Uniform 変数の情報の取得
        var uniLocations = [];
        uniLocations[0]  = gl.getUniformLocation(program, 'mwMatrix');
        uniLocations[1]  = gl.getUniformLocation(program, 'mpvMatrix');
        
        gl.useProgram(program);

        // モデルの構築
        var vertex_positions = new Float32Array([
         // x     y     z
          -1.0, -1.0, +1.0, 
          -1.0, -1.0, -1.0,
          -1.0, +1.0, -1.0,
          -1.0, -1.0, +1.0,
          -1.0, +1.0, -1.0,
          -1.0, +1.0, +1.0,

          +1.0, -1.0, -1.0,
          -1.0, -1.0, -1.0,
          -1.0, -1.0, +1.0,
          +1.0, -1.0, -1.0,
          -1.0, -1.0, +1.0,
          +1.0,-1.0, +1.0,

          -1.0, +1.0, -1.0,
          -1.0, -1.0, -1.0,
          +1.0, -1.0, -1.0,
          -1.0, +1.0, -1.0,
          +1.0, -1.0, -1.0,
          +1.0, +1.0, -1.0,

          +1.0, -1.0, +1.0,
          +1.0, +1.0, -1.0,
          +1.0, -1.0, -1.0,
          +1.0, -1.0, +1.0,
          +1.0, +1.0, +1.0,
          +1.0, +1.0, -1.0,

          +1.0, +1.0, -1.0,
          -1.0, +1.0, +1.0,
          -1.0, +1.0, -1.0,
          +1.0, +1.0, -1.0,
          +1.0, +1.0, +1.0,
          -1.0, +1.0, +1.0,

          -1.0, +1.0, +1.0,
          +1.0, -1.0, +1.0,
          -1.0, -1.0, +1.0,
          -1.0, +1.0, +1.0,
          +1.0, +1.0, +1.0,
          +1.0, -1.0, +1.0,

        ]);

        const vertexBufferPosition = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferPosition);
        gl.bufferData(gl.ARRAY_BUFFER, vertex_positions, gl.STATIC_DRAW);
        var posAttr = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(posAttr);
        gl.vertexAttribPointer(posAttr, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);        // 悪さされないようにバッファを外す
        
        var vertex_colors = new Uint8Array([
            // R  G   B    R   G   B    R   G   B    R   G   B    R   G   B    R   G   B
            255,  0,  0, 255,  0,  0, 255,  0,  0, 255,  0,  0, 255,  0,  0, 255,  0,  0, 
              0,255,  0,   0,255,  0,   0,255,  0,   0,255,  0,   0,255,  0,   0,255,  0, 
              0,  0,255,   0,  0, 255,  0,  0, 255,  0,  0, 255,  0,  0, 255,  0,  0,255,
            255,255,  0, 255,255,  0, 255,255,  0, 255,255,  0, 255,255,  0, 255,255,  0, 
              0,255,255,   0,255,255,   0,255,255,   0,255,255,   0,255,255,   0,255,255, 
            255,  0,255, 255,  0, 255,255,  0, 255,255,  0, 255,255,  0, 255,255,  0,255,
        ]);
        const vertexBufferColor = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferColor);
        gl.bufferData(gl.ARRAY_BUFFER, vertex_colors, gl.STATIC_DRAW);
        var colAttr = gl.getAttribLocation(program, 'color');
        gl.enableVertexAttribArray(colAttr);
        gl.vertexAttribPointer(colAttr, 3, gl.UNSIGNED_BYTE, true, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);        // 悪さされないようにバッファを外す
        
        // シーンの情報の設定
        gl.enable(gl.DEPTH_TEST);

        window.requestAnimationFrame(update);
        
        ////////////////////////////
        // フレームの更新
        ////////////////////////////
        var lastTime = null;
        var rotation = 0.0;// 物体を回す角度

        // 射影行列の生成
        var mat = new matIV();// 行列のシステムのオブジェクト
        var pMatrix   = mat.identity(mat.create());// 射影行列
        mat.perspective(60, canvas.width / canvas.height, 0.01, 10.0, pMatrix);// 射影行列の生成

        function update(timestamp){
            // 更新間隔の取得
            var elapsedTime = lastTime ? timestamp - lastTime : 0;
            lastTime = timestamp;
            
            ////////////////////////////
            // 動かす
            ////////////////////////////
            
            // カメラを回すパラメータ
            rotation += 0.0001 * elapsedTime;
            if(1.0 < rotation) rotation -= 1.0;

            // ワールド行列の生成
            var wMatrix   = mat.identity(mat.create());

            // ビュー行列の生成
            var camera_pos = [
                5.0 * Math.cos(2 * Math.PI * rotation),
                3.0, 
               -5.0 * Math.sin(2 * Math.PI * rotation)];// 少し上でぐるぐる回す
            var look_at = [0.0, 0.0, 0.0];
            var up = [0.0, 1.0, 0.0];
            var vMatrix = mat.create();
            mat.lookAt(camera_pos, look_at, up, vMatrix);
            // ビュー射影行列の生成
            var pvMatrix = mat.create();
            mat.multiply (pMatrix, vMatrix, pvMatrix);
            
            ////////////////////////////
            // 描画
            ////////////////////////////
            // 画面クリア
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clearDepth(1.0);// 初期設定する深度値(一番奥の深度)
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            // ポリゴンの描画
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferPosition);
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferColor);
            gl.uniformMatrix4fv(uniLocations[0], false, wMatrix);// ワールド行列の設定
            gl.uniformMatrix4fv(uniLocations[1], false, pvMatrix);// ビュー射影行列の設定
            gl.drawArrays(gl.TRIANGLES, 0, 6*6);// 2セットの3角形ポリゴンによる平面が6つ
            
            gl.flush();// 画面更新

            // ブラウザに再描画時にアニメーションの更新を要求
            window.requestAnimationFrame(update);
        }
        
    }, false);
})();
