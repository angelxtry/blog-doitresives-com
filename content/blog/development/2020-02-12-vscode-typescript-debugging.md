---
title: VSCode Typescript Debugging
date: 2020-02-12 22:02:24
category: development
---

알고리즘 문제를 풀다가 재귀가 알쏭달쏭해서 debugging을 해보고 싶었다.

VSCode에서 좌측의 벌레(?) 아이콘을 누르거나 맥 기준으로 (Shift + Command + D)를 누르고 Debug with Node.js를 선택한다.

해당 프로젝트에서 처음 debugging을 시도하면 `launch.json` 파일을 작성하라는 팝업창이 생긴다.

Open launch.json을 선택하면 해당 폴더에 `.vscode/launch.json` 이 생성된다.

```json {9-10}
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/allAnagram/allAnagram.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/**/*.js"]
    }
  ]
}
```

나머지는 모두 자동 생성된 코드이고 직접 작성한 것은 `program`, `preLaunchTask` 2가지다.

program은 entry point가 되는 파일을 선택하면 된다.

preLaunckTask는 내가 선택한 파일이 Typescript이므로 tsc를 입력한다.

debugging을 위해서는 tsconfig.json 파일에서 `"sourceMap": true` 옵션을 추가해야 한다.

해당 옵션을 추가하면 xxx.js.map 이라는 파일이 생성된다.

sourcemap은 ts 파일이 js 파일로 변환되었을 때 ts 코드가 어떤 js 코드로 변환되었는지 확인할 수 있도록 해주는 파일이다.

여기까지 설정하면 VSCode에서 debugging이 잘 진행된다.
