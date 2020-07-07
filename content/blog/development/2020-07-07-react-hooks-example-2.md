---
title: "React Hooks Example #2 forwardRef, useImperativeHandle"
date: 2020-07-08 00:07:77
category: development
---

## forwardRef

```jsx
import React, { useRef, useEffect } from "react";

const Ref2 = () => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    console.log({ inputRef });
  }, []);

  return (
    <div>
      <h1>useRef Example2</h1>
      <input type="text" ref={inputRef} />
    </div>
  );
};

export default Ref2;
```

위 코드를 실행하면 Input element에 자동으로 focus가 설정된다.

자기 자신의 element는 useRef만으로 접근할 수 있다.

Third party component이거나 별도의 파일에 생성한 공통 component를 Custom Input이라고 가정하자.

화면이 렌더링되자마자 Custom Input에 focus를 설정하려면 어떻게 해야할까?

```jsx
import React, { useRef, useEffect } from "react";

const CustomInput = (ref) => {
  return <input type="text" ref={ref} />;
};

const Ref2 = () => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    console.log({ inputRef });
  }, []);

  return (
    <div>
      <h1>useRef Example2</h1>
      <CustomInput ref={inputRef} />
    </div>
  );
};

export default Ref2;
```

위와 같이 작성하면 다음의 에러 메세지를 만나게 된다.

```cmd
Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
```

forwardRef를 사용하여 다음과 같이 작성해보자.

```jsx
import React, { useRef, useEffect, forwardRef } from "react";

const CustomInput = forwardRef(function CInput(prop, ref) {
  return <input type="text" ref={ref} />;
});

const Ref2 = () => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    console.log({ inputRef });
  }, []);

  return (
    <div>
      <h1>useRef Example2</h1>
      <CustomInput ref={inputRef} />
    </div>
  );
};

export default Ref2;
```

forwardRef를 사용하면 자기 자신의 element가 아닌 child의 element에 접근할 수 있다.

다음과 같은 형태로 주로 사용한다.

```jsx
import React, { forwardRef } from "react";

const CustomInput = (prop, ref) => {
  return <input type="text" ref={ref} />;
};

export default forwardRef(CustomInput);
```

## useImperativeHandle

```jsx
import React, { useRef, useImperativeHandle, forwardRef } from "react";

function CustomInput2(props, ref) {
  const inputEl = useRef();
  useImperativeHandle(ref, () => inputEl.current);
  return <input type="text" ref={inputEl} />;
}

export default forwardRef(CustomInput2);
```

```jsx
import React, { useRef } from "react";
import CustomInput2 from "./CustomInput2";

function ImperativeHandleExample() {
  const inputEl = useRef(null);

  const copy = () => {
    inputEl.current.select();
    document.execCommand("copy");
  };

  return (
    <>
      <CustomInput2 ref={inputEl} />
      <button type="button" onClick={copy}>
        Copy
      </button>
    </>
  );
}

export default ImperativeHandleExample;
```

Input에 text를 입력하고 버튼을 클릭하면 text를 복사한다.

ImperativeHandleExample에서 inputEl을 생성하여 CustomInput2로 전달했다.

CustomInput2에서는 useImperativeHandle과 forwardRef를 함께 사용했다.

useImperativeHandle은 첫 번째 인자로 부모에게서 전달받은 ref, 두 번째 인자로 내부에서 생성한 ref를 받는다.

이 경우 단순히 forwarfRef만 사용한 경우와 달리 부모에게서 ref를 전달받지 않아도, 해당 기능이 동작하지 않을 뿐 에러가 발생하지는 않는다.

```jsx
import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
} from "react";

const ElaborateInput = forwardRef(function EInput(
  { hasError, placeholder, value, update },
  ref
) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => {
    return {
      foucs() {
        inputRef.current.focus();
      },
    };
  });
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => update(e.target.value)}
      placeholder={placeholder}
      style={{
        padding: "5px 15px",
        borderWidth: "3px",
        borderStyle: "solid",
        borderColor: hasError ? "crimson" : "#999",
        borderRadius: "5px",
        margin: "0 10px",
        textAlign: "center",
      }}
    />
  );
});

const ImperativeHandle = () => {
  const [city, setCity] = useState("Seattle");
  const [state, setState] = useState("WA");
  const [error, setError] = useState("");
  const cityEl = useRef();
  const stateEl = useRef();

  function validate() {
    if (!/^[\D]+$/.test(city)) {
      setError("city");
      cityEl.current.focus();
      return;
    }

    if (!/^[A-Z]{2}$/.test(state)) {
      setError("state");
      stateEl.current.focus();
      return;
    }

    setError("");
    alert("Valid Form!");
  }

  return (
    <div>
      <h1>useImperativeHandle Example</h1>
      <ElaborateInput
        hasError={error === "city"}
        placeholder="City"
        value={city}
        update={setCity}
        ref={cityEl}
      />
      <ElaborateInput
        hasError={error === "state"}
        placeholder="State"
        value={state}
        update={setState}
        ref={stateEl}
      />
      <button type="button" onClick={validate}>
        Validate Form
      </button>
    </div>
  );
};

export default ImperativeHandle;
```

useImperativeHandle을 사용하면 formik과 같은 form library가 어떻게 동작하는지 알 수 있다.
