---
title: "[CSS] flex로 modal 만들기"
date: 2020-04-13 01:04:46
category: development
---

[인프런의 CSS Flex와 Grid 제대로 익히기](https://www.inflearn.com/course/css-flex-grid-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%9D%B5%ED%9E%88%EA%B8%B0/)를 보고 작성한 글입니다.

화면 가운데에 출력되는 모달창을 만들어보자.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="./default.css" />
    <link rel="stylesheet" href="./ui.css" />
  </head>
  <body>
    <div class="modal">
      <div class="dialog">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed, quibusdam
        nam rem necessitatibus ipsum saepe repudiandae exercitationem quaerat.
        Vitae voluptates repudiandae possimus, odio doloribus temporibus
        distinctio sit similique alias cum aliquam neque quo magnam dicta itaque
        quam accusamus aspernatur quae consequuntur tempora nam quasi officia.
        Reiciendis possimus aliquid repellat iusto?˝
      </div>
    </div>
  </body>
</html>
```

```css
/* modal */
.modal {
  background-color: rgba(0, 0, 0, 0.3);
}
```

text 위에 불투명한 색이 추가된다.

```css
/* modal */
.modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
```

position과 위치를 지정하면 background가 화면 전체를 차지하게 된다.

```css
/* modal */
.modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
.dialog {
  width: 50vw;
  padding: 2em;
  border-radius: 1em;
  background-color: white;
}
```

이 상태에서 .dialog를 추가한다. width 등을 설정하면 화면 전체를 차지하는 불투명한 배경은 그대로 유지한 채 text만 dialog에 포함된 것 같이 표시된다.

```css
/* modal */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
.dialog {
  width: 50vw;
  padding: 2em;
  border-radius: 1em;
  background-color: white;
}
```

dialog를 화면 중앙에 위치하도록 .modal을 flex로 설정하고 `justify-content: center; align-items: center;`를 설정한다.
