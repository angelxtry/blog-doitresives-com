---
title: 2021-11-06 React 컴포넌트에 Generic을 사용하여 타입을 강화하고 일반화하기
date: 2021-11-06 02:11:44
category: development
---

![React + TypeScript](https://drive.google.com/uc?export=view&id=1l8iXg5WeNJOhJKPVdTOdkHrCgKYqJBF-)

회사에서 admin 페이지를 만들기 위해 Antd를 사용하고 있습니다. 보통 admin 페이지는 다양한 조건으로 데이터를 조회하여 테이블 등에 출력하는 작업을 많이 하게 됩니다. 저희는 테이블 위쪽에 다양한 버튼을 그룹지어 배치하고 해당 컴포넌트를 filter라고 이름 붙였습니다.

이 filter를 구현하기 위해 Antd의 `Radio.Group`을 이용했습니다.

[Antd 공식 페이지에서 다음과 같은 예제 코드를 확인할 수 있습니다.](https://ant.design/components/radio/)

```jsx
import { Radio } from 'antd';

ReactDOM.render(
  <>
    <Radio.Group defaultValue="a" buttonStyle="solid">
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b">Shanghai</Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>
  </>,
  mountNode,
);
```

## 문제가 많은 기존 코드

처음에는 이 코드를 활용해서 다음과 같이 filter 컴포넌트를 만들었습니다.

```tsx
import { Radio, RadioChangeEvent } from 'antd';

import { translate } from '@/locale';

interface RadioData {
  id: string;
  value: string;
}

interface RadioGroupProps {
  radioData: RadioData[];
  checked: string;
  onChange: (e: RadioChangeEvent) => void;
  className?: string;
}

export const CustomRadioGroup = ({
  radioData,
  checked,
  onChange,
  className,
}: RadioGroupProps) => {
  return (
    <Radio.Group
      defaultValue={radioData[0].value}
      value={checked}
      onChange={onChange}
      buttonStyle='solid'
      className={className}
    >
      {radioData.map((option: RadioData) => (
        <Radio.Button key={option.id} value={option.value}>
          {translate(option.id)}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};
```

`CustomRadioGroup` 컴포넌트는 다음과 같이 사용했습니다.

```tsx
import { RadioChangeEvent } from 'antd';

import { CustomRadioGroup } from '@/component/CustomRadioGroup';

export type SettlementCountry = 'ALL' | 'KR' | 'VN';

const CountryRadioOption = [
  {
    id: 'ALL',
    value: 'ALL',
  },
  {
    id: 'KR',
    value: 'KR',
  },
  {
    id: 'VN',
    value: 'VN',
  },
];

interface SettlementCountryFilterProps {
  checked: SettlementCountry;
  onChange: (e: RadioChangeEvent) => void;
  className: string;
}

export const SettlementCountryFilter = ({
  checked,
  onChange,
  className,
}: SettlementCountryFilterProps) => {
  return (
    <CustomRadioGroup
      radioData={CountryRadioOption}
      checked={checked}
      onChange={onChange}
      className={className}
    />
  );
};

```

`SettlementCountryFilter`와 비슷한 역할을 하는 컴포넌트들이 여러 개 존재합니다.

상위 컴포넌트에서 이런 filter 컴포넌트들을 다시 한번 하나로 묶어주었습니다.

```tsx
import { RadioChangeEvent } from 'antd';

import {
  SettlementCountry,
  SettlementCountryFilter,
} from '@/component/SettlementCountryFilter';
import {
  SettlementDetailStatus,
  SettlementDetailStatusFilter,
} from '@/component/SettlementDetailStatusFilter';
import {
  SettlementProcessStatus,
  SettlementProcessStatusFilter,
} from '@/component/SettlementProcessStatusFilter';

interface SettlementFiltersProps {
  checkedSettlementCountry: SettlementCountry;
  checkedSettlementProcessStatus: SettlementProcessStatus;
  checkedSettlementDetailStatus: SettlementDetailStatus;
  onChangeCountry: (filter: RadioChangeEvent) => void;
  onChangeProcessStatus: (filter: RadioChangeEvent) => void;
  onChangeSettlementStatus: (filter: RadioChangeEvent) => void;
}

export const SettlementFilters = ({
  checkedSettlementCountry,
  checkedSettlementProcessStatus,
  checkedSettlementDetailStatus,
  onChangeCountry,
  onChangeProcessStatus,
  onChangeSettlementStatus,
}: SettlementFiltersProps) => {
  return (
    <>
      <section>
        <SettlementCountryFilter
          checked={checkedSettlementCountry}
          onChange={onChangeCountry}
        />
        <SettlementProcessStatusFilter
          checked={checkedSettlementProcessStatus}
          onChange={onChangeProcessStatus}
        />
        <SettlementDetailStatusFilter
          checked={checkedSettlementDetailStatus}
          onChange={onChangeSettlementStatus}
        />
      </section>
    </>
  );
};

```


코드는 정상적으로 동작합니다. 하지만 단점이 많은 코드라고 생각했습니다. 단점을 하나씩 살펴보겠습니다.

1. `CustomRadioGroup`에서 RadioData 인터페이스의 id, value는 특정 타입으로 설정된 것이 아니라 단순히 `string`으로 설정되어 있습니다. **특정 타입으로 설정하고 타입에 적합한 값만 받는 것이 더 안전합니다.**
<br />
<br />
2. `CustomRadioGroup`에서 checked도 특정한 타입을 지정하지 못했습니다. `SettlementCountryFilter` 컴포넌트에서는 타입이 지정되었지만 **여러 컴포넌트가 `CustomRadioGroup` 컴포넌트를 활용하다보니 특정 타입을 지정하지 않고 `string`을 사용했습니다.**
   <br />
   <br />
3. `SettlementCountryFilter` 컴포넌트의 역할이 애매합니다. `SettlementCountryFilter`와 `CustomRadioGroup` 컴포넌트는 props가 거의 동일하니다. 차이점은 `SettlementCountryFilter`에서 `RadioGroups`에서 사용할 데이터를 선언하고 그 데이터를 `CustomRadioGroup`으로 전달하는 것 밖에 없습니다.
   <br />
   <br />
4. `SettlementCountryFilter` 컴포넌트와 `SettlementProcessStatusFilter`, `SettlementDetailStatusFilter` 컴포넌트는 데이터만 다를 뿐 완전히 동일한 컴포넌트입니다. **불필요한 코드 중복이 많았습니다.**

## 리팩토링 후 개선된 코드

제네릭을 사용하여 다음과 같이 개선했습니다.

```tsx
import { Radio } from 'antd';

interface CustomRadioGroupProps<T> {
  options: { key: string; value: T; title?: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export const CustomRadioGroup = <T extends string>({
  options,
  value,
  onChange,
  className,
}: CustomRadioGroupProps<T>) => {
  return (
    <Radio.Group
      defaultValue={options[0].value}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      buttonStyle='solid'
      className={className}
    >
      {options.map((option) => (
        <Radio.Button key={option.key} value={option.value}>
          {option.title ? option.title : option.value}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};
```

`CustomRadioGroupProps`를 제네릭을 이용하여 타입을 강화했습니다. 수정 전에는 value가 `string` 이었기에 오류가 발생할 가능성이 있었습니다. options, value, onChange도 제네릭을 이용해서 모두 같은 타입을 사용하도록 개선되었습니다.

```tsx
import { CustomRadioGroup } from '@/component';
import {
  SettlementCountryRadioOptions,
  SettlementDetailStatusRadioOptions,
  SettlementProcessRadioOption,
} from '@/domain/Settlement/constants';
import {
  SettlementCountry,
  SettlementDetailStatus,
  SettlementProcessStatus,
} from '@/domain/Settlement/types';

interface SettlementFiltersProps {
  checkedSettlementCountry: SettlementCountry;
  checkedSettlementProcessStatus: SettlementProcessStatus;
  checkedSettlementDetailStatus: SettlementDetailStatus;
  onChangeCountry: (value: SettlementCountry) => void;
  onChangeProcessStatus: (value: SettlementProcessStatus) => void;
  onChangeSettlementDetailStatus: (value: SettlementDetailStatus) => void;
}

export const SettlementFilters = ({
  checkedSettlementCountry,
  checkedSettlementProcessStatus,
  checkedSettlementDetailStatus,
  onChangeCountry,
  onChangeProcessStatus,
  onChangeSettlementDetailStatus,
}: SettlementFiltersProps) => {
  return (
    <>
      <section>
        <CustomRadioGroup
          options={SettlementCountryRadioOptions}
          checked={checkedSettlementCountry}
          onChange={onChangeCountry}
        />
        <CustomRadioGroup
          options={SettlementProcessRadioOption}
          checked={checkedSettlementProcessStatus}
          onChange={onChangeProcessStatus}
        />
        <CustomRadioGroup
          options={SettlementDetailStatusRadioOptions}
          checked={checkedSettlementDetailStatus}
          onChange={onChangeSettlementDetailStatus}
        />
      </section>
    </>
  );
};
```

`CustomRadioGroup`을 사용하는 컴포넌트도 간단해졌습니다. `SettlementCountryFilter` 컴포넌트는 삭제되었습니다. 비슷한 역할을 하고 있었던 다른 두 컴포넌트도 삭제했습니다. 단점에서 언급했었지만 `SettlementCountryFilter`는 역할이 애매했었습니다. 의미상으로 명확하게 `SettlementCountryFilter`라는 필터를 만들어주는 장점은 있었지만 동일한 코드 중복이 심했습니다. 중복 코드를 제외하면 `SettlementCountryFilter`의 역할은 해당 필터에 맞는 데이터를 제공해주는 것 밖에 없었습니다. 하지만 컴포넌트에 데이터가 포함되어 있는 것도 좋은 코드는 아니라고 생각했습니다.

그래서 데이터는 추출하여 별도로 관리하고 import하여 사용하는 방식으로 변경했습니다.  `SettlementFilters`에서 `CustomRadioGroup` 컴포넌트를 직접 사용하여 필터를 만드는 방식으로 처리했습니다.

## 마치며

이렇게 코드를 개선하면서 개선된 점을 다시 한번 정리해보면 다음 두 가지로 요약할 수 있습니다.

1. 중복 코드를 제거하여 코드량이 줄었습니다.
2. 컴포넌트에 타입을 명확하게 지정하여 오류가 발생할 가능성이 줄어들었습니다.

마지막 두 코드 덩어리가 핵심인데 설명이 너무 길었네요. 읽어주셔서 감사합니다!
