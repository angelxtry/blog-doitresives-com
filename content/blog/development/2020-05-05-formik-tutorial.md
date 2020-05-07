---
title: Formik tutorial
date: 2020-05-05 20:05:34
category: development
---

`Build forms in React, without the tears.` 라는 재치있는 슬로건으로 시작하는 react form 라이브러리다.

사이드 프로젝트에서 사용해보려고 마음먹고 있었는데, 페이스북에서 괜찮아보이는 동영상을 발견해서 따라해봤다.

[Formik: React Forms Tutorial with Yup and Material](https://www.youtube.com/watch?v=kYyaJyTLjpk&feature=emb_title)

## 프로젝트 생성

create-react-app 으로 프로젝트를 생성한다.

```js
yarn create react-app formik-tutorial --template typescript
```

package를 설치한다.

```js
yarn add formik yup @material-ui/core

yarn add -D @types/yup
```

## 기본 코드 작성

```tsx
import React from 'react';
import { Card, CardContent, Typography, Button } from '@material-ui/core';
import { Formik, Form } from 'formik';

const initialValues = {
  fullName: '',
  initialInvestment: undefined,
  investmentRist: [],
  commentAboutInvestmentRist: '',
  dependents: -1,
  acceptedTermsAndConditions: false,
};

export default function FormDemo() {
  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h4">New Account</Typography>
          <Formik
            initialValues={initialValues}
            onSubmit={() => console.log('formik!')}
          >
            {({ values }) => (
              <Form>
                <Button type="submit">Submit</Button>
                <pre>{JSON.stringify(values, null, 2)}</pre>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
```

initialValues, onSubmit을 적당히 설정하고 Form을 정의한다.

values에는 initialValues가 그대로 전달된다.

value의 변화를 확인할 수 있도록 Form에 pre tag를 추가했다.

```tsx
import React from 'react';
import { Card, Typography, CardContent, Button } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';

const initialValues = {
  fullName: '',
  initialInvestment: undefined,
  investmentRist: [],
  commentAboutInvestmentRist: '',
  dependents: -1,
  acceptedTermsAndConditions: false,
};

export function FormDemo() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4">New Account</Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={() => {
          console.log(1);
        }}
        >
          {({ values }) => (
            <Form>
              <Field name="fullName" />
              <Field name="initialInvestment" type="number" />

              <Button type="submit">Submit</Button>
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
```

Field를 추가했다. Field는 기본적으로 input으로 설정된다.

name은 initialValues의 key와 일치해야 한다.

브라우저에서 확인해보면 input box에 값을 입력하면 fullName에 반영되는 것을 확인할 수 있다.

initialInvestment Field는 type을 number로 설정했다. 브라우저에서 input이 number에 맞게 변경된다.

```tsx
<Field name="investmentRisk" type="checkbox" value="high" />
<Field name="investmentRisk" type="checkbox" value="medium" />
<Field name="investmentRisk" type="checkbox" value="low" />
```

checkbox를 추가했다. name이 모두 동일하다. multiple checkbox 이므로 중복 선택이 가능하고 배열에 element로 value가 저장된다.

```tsx
<Field name="commentAboutInvestmentRisk" as="textarea" />
```

commentAboutInvestmentRisk는 as를 이용하여 textarea로 설정한다.

```tsx
<Field name="dependents" as="select">
  <option value={-1}>Select one</option>
  <option value={0}>0</option>
  <option value={1}>1</option>
  <option value={2}>2</option>
  <option value={3}>3</option>
  <option value={4}>4</option>
  <option value={5}>5</option>
</Field>
```

select box다. 결과값이 string 인 것에 유의하자.

```tsx
<Field name="acceptedTermsAndConditions" type="checkbox" />
```

checkbox가 단독으로 사용되면 결과값은 boolean이 된다.

지금까지의 코드는 다음과 같다.

```tsx
import React from 'react';
import { Card, CardContent, Typography, Button } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';

const initialValues = {
  fullName: '',
  initialInvestment: undefined,
  investmentRist: [],
  commentAboutInvestmentRist: '',
  dependents: -1,
  acceptedTermsAndConditions: false,
};

export default function FormDemo() {
  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h4">New Account</Typography>
          <Formik
            initialValues={initialValues}
            onSubmit={() => console.log('formik!')}
          >
            {({ values }) => (
              <Form>
                <Field name="fullName" />
                <Field name="initialInvestment" type="number" />

                <Field name="investmentRisk" type="checkbox" value="high" />
                <Field name="investmentRisk" type="checkbox" value="medium" />
                <Field name="investmentRisk" type="checkbox" value="low" />

                <Field name="commentAboutInvestmentRisk" as="textarea" />

                <Field name="dependents" as="select">
                  <option value={-1}>Select one</option>
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </Field>

                <Field name="acceptedTermsAndConditions" type="checkbox" />

                <Button type="submit">Submit</Button>

                <pre>{JSON.stringify(values, null, 2)}</pre>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
```

## material-ui 추가

```tsx
<Field name="fullName" as={TextField} label="Full Name" />
<Field
  name="initialInvestment"
  type="number"
  as={TextField}
  label="Initial Investment"
/>
```

input box는 as를 이용하여 TextField를 지정하고 label을 추가한다.

```tsx
export interface MyCheckboxProps extends CheckboxProps {
  name: string;
  value?: string | number;
  label?: string;
}
export function MyCheckbox(props: MyCheckboxProps) {
  const [field] = useField({
    name: props.name,
    value: props.value,
    type: 'checkbox',
  });
  return (
    <FormControlLabel
      control={<Checkbox {...props} {...field} />}
      label={props.label}
    />
  );
}
```

multiple checkbox를 위해 추가 component가 필요하다.

MyCheckbox는 useField를 사용하여 인자로 받은 값들을 설정한 후 Checkbox에 다시 전달한다.

```tsx
<MyCheckbox name="investmentRisk" value="High" label="High - Suber Risky" />
<MyCheckbox name="investmentRisk" value="Medium" label="Medium - Risky" />
<MyCheckbox name="investmentRisk" value="Low" label="Low - Safe" />
```

MyCheckbox를 사용하여 multiple checkbox를 위와같이 수정했다.

나머지 input과 전체적인 UI를 조정한다.

```tsx
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CheckboxProps,
  MenuItem,
  Box,
  FormGroup,
} from '@material-ui/core';
import { Formik, Form, Field, useField } from 'formik';

const initialValues = {
  fullName: '',
  initialInvestment: undefined,
  investmentRist: [],
  commentAboutInvestmentRist: '',
  dependents: -1,
  acceptedTermsAndConditions: false,
};

export default function FormDemo() {
  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h4">New Account</Typography>
          <Formik
            initialValues={initialValues}
            onSubmit={() => console.log('formik!')}
          >
            {({ values }) => (
              <Form>
                <Box marginBottom={2}>
                  <FormGroup>
                    <Field name="fullName" as={TextField} label="Full Name" />
                  </FormGroup>
                </Box>

                <Box marginBottom={2}>
                  <FormGroup>
                    <Field
                      name="initialInvestment"
                      type="number"
                      as={TextField}
                      label="Initial Investment"
                    />
                  </FormGroup>
                </Box>

                <Box marginBottom={2}>
                  <FormGroup>
                    <MyCheckbox
                      name="investmentRisk"
                      value="High"
                      label="High - Suber Risky"
                    />
                    <MyCheckbox
                      name="investmentRisk"
                      value="Medium"
                      label="Medium - Risky"
                    />
                    <MyCheckbox
                      name="investmentRisk"
                      value="Low"
                      label="Low - Safe"
                    />
                  </FormGroup>
                </Box>

                <Box marginBottom={2}>
                  <FormGroup>
                    <Field
                      name="commentAboutInvestmentRisk"
                      label="Comment About Investment Risk"
                      as={TextField}
                      multiline
                      rows={3}
                      rowsMax={10}
                    />
                  </FormGroup>
                </Box>

                <Box marginBottom={2}>
                  <FormGroup>
                    <Field
                      name="dependents"
                      label="Dependents"
                      as={TextField}
                      select
                    >
                      <MenuItem value={-1}>Select one</MenuItem>
                      <MenuItem value={0}>0</MenuItem>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                    </Field>
                  </FormGroup>
                </Box>

                <Box marginBottom={2}>
                  <FormGroup>
                    <MyCheckbox
                      name="acceptedTermsAndConditions"
                      label="Accept terms and conditions"
                    />
                  </FormGroup>
                </Box>

                <Button type="submit">Submit</Button>

                <pre>{JSON.stringify(values, null, 2)}</pre>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}

export interface MyCheckboxProps extends CheckboxProps {
  name: string;
  value?: string | number;
  label?: string;
}
export function MyCheckbox(props: MyCheckboxProps) {
  const [field] = useField({
    name: props.name,
    value: props.value,
    type: 'checkbox',
  });
  return (
    <FormControlLabel
      control={<Checkbox {...props} {...field} />}
      label={props.label}
    />
  );
}
```

## validation

yup을 이용해 validation을 설정한다.

```tsx
import { object, string, number, boolean, array } from 'yup';

const initialValues = {
  fullName: '',
  initialInvestment: undefined,
  investmentRist: [],
  commentAboutInvestmentRist: '',
  dependents: -1,
  acceptedTermsAndConditions: false,
};

const validationSchema = object({
  fullName: string().required().min(2).max(100),
  initialInvestment: number().required().min(0).max(100),
  investmentRisk: array(string().oneOf(['High', 'Medium', 'Low'])).min(1),
  commentAboutInvestmentRisk: string().required().min(20).max(100),
  dependents: number().required().min(0).max(5),
  acceptedTermsAndConditions: boolean().oneOf([true]),
});


export function FormDemo() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4">New Account</Typography>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={() => {
            console.log(1);
          }}
        >
          {({ values, errors }) => (
            <Form>
              <pre>{JSON.stringify(errors, null, 2)}</pre>
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
```

## error 처리

모든 에러는 Form 안의 errors에 전달된다.

```tsx
{({ values, errors, touched }) => (
  <Form>
    <Box marginBottom={2}>
      <FormGroup>
        <Field name="fullName" as={TextField} label="Full Name" />
        {touched.fullName && errors.fullName ? errors.fullName : null}
      </FormGroup>
    </Box>
  </Form>
)}
```

touched props를 이용하여 해당 UI을 선택했었는지를 확인할 수 있다.

해당 UI를 선택했었고 error가 있다면 error가 출력된다.

```tsx
{({ values, errors }) => (
  <Form>
    <Box marginBottom={2}>
      <FormGroup>
        <Field name="fullName" as={TextField} label="Full Name" />
      </FormGroup>
      <ErrorMessage name="fullName" />
    </Box>
  </Form>
)}
```

touched를 사용하지 않고 ErrorMessage로 처리하는 것이 더 간단하다.

지금까지 코드는 다음과 같다.

```tsx
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CheckboxProps,
  MenuItem,
  Box,
  FormGroup,
} from '@material-ui/core';
import { Formik, Form, Field, useField, ErrorMessage } from 'formik';
import { object, string, number, boolean, array } from 'yup';

const initialValues = {
  fullName: '',
  initialInvestment: undefined,
  investmentRist: [],
  commentAboutInvestmentRist: '',
  dependents: -1,
  acceptedTermsAndConditions: false,
};

const validationSchema = object({
  fullName: string().required().min(2).max(100),
  initialInvestment: number().required().min(0).max(100),
  investmentRisk: array(string().oneOf(['High', 'Medium', 'Low'])).min(1),
  commentAboutInvestmentRisk: string().required().min(20).max(100),
  dependents: number().required().min(0).max(5),
  acceptedTermsAndConditions: boolean().oneOf([true]),
});

export default function FormDemo() {
  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h4">New Account</Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={() => console.log('formik!')}
          >
            {({ values, errors }) => (
              <Form>
                <Box marginBottom={2}>
                  <FormGroup>
                    <Field name="fullName" as={TextField} label="Full Name" />
                    <ErrorMessage name="fullName" />
                  </FormGroup>
                </Box>

                <Box marginBottom={2}>
                  <FormGroup>
                    <Field
                      name="initialInvestment"
                      type="number"
                      as={TextField}
                      label="Initial Investment"
                    />
                    <ErrorMessage name="initialInvestment" />
                  </FormGroup>
                </Box>

                <Box marginBottom={2}>
                  <FormGroup>
                    <MyCheckbox
                      name="investmentRisk"
                      value="High"
                      label="High - Suber Risky"
                    />
                    <MyCheckbox
                      name="investmentRisk"
                      value="Medium"
                      label="Medium - Risky"
                    />
                    <MyCheckbox
                      name="investmentRisk"
                      value="Low"
                      label="Low - Safe"
                    />
                    <ErrorMessage name="initialInvestment" />
                  </FormGroup>
                </Box>

                <Box marginBottom={2}>
                  <FormGroup>
                    <Field
                      name="commentAboutInvestmentRisk"
                      label="Comment About Investment Risk"
                      as={TextField}
                      multiline
                      rows={3}
                      rowsMax={10}
                    />
                    <ErrorMessage name="commentAboutInvestmentRisk" />
                  </FormGroup>
                </Box>

                <Box marginBottom={2}>
                  <FormGroup>
                    <Field
                      name="dependents"
                      label="Dependents"
                      as={TextField}
                      select
                    >
                      <MenuItem value={-1}>Select one</MenuItem>
                      <MenuItem value={0}>0</MenuItem>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                    </Field>
                    <ErrorMessage name="dependents" />
                  </FormGroup>
                </Box>

                <Box marginBottom={2}>
                  <FormGroup>
                    <MyCheckbox
                      name="acceptedTermsAndConditions"
                      label="Accept terms and conditions"
                    />
                    <ErrorMessage name="acceptedTermsAndConditions" />
                  </FormGroup>
                </Box>

                <Button type="submit">Submit</Button>

                <pre>{JSON.stringify(errors, null, 2)}</pre>
                <pre>{JSON.stringify(values, null, 2)}</pre>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}

export interface MyCheckboxProps extends CheckboxProps {
  name: string;
  value?: string | number;
  label?: string;
}
export function MyCheckbox(props: MyCheckboxProps) {
  const [field] = useField({
    name: props.name,
    value: props.value,
    type: 'checkbox',
  });
  return (
    <FormControlLabel
      control={<Checkbox {...props} {...field} />}
      label={props.label}
    />
  );
}
```

error를 좀 더 명확하게 표현하려면 다음과 같이 처리한다.

```tsx
{({ values, errors, touched, isSubmitting }) => (
  <Form>
    <Box marginBottom={2}>
      <FormGroup>
        <Field
          name="fullName"
          as={TextField}
          label="Full Name"
          helperText={touched.fullName && errors.fullName}
          error={touched.fullName && errors.fullName}
        />
      </FormGroup>
    </Box>
  </Form>
  ...
```
