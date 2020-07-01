---
title: "[Complete Intro to React, v5] React 기초 다시 한번"
date: 2020-07-01 16:07:35
category: development
---

<https://frontendmasters.com/courses/complete-react-v5/> 강의를 듣고 내용 정리.

## 1. Pure React

아무것도 없는 상태에서 react app을 만들어보자.

빈 폴더에 src 폴더를 만든다.

src/index.html 파일을 추가한다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Adopt Me!</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div id="root">not rendered</div>
    <script src="https://unpkg.com/react@16.8.4/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16.8.4/umd/react-dom.development.js"></script>
  </body>
</html>
```

react, react-dom을 CDN을 이용하여 불러온다.

src/style.css 파일을 추가한다.

<https://raw.githubusercontent.com/btholt/complete-intro-to-react-v5/master/src/style.css>

### React Code 추가

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Adopt Me!</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div id="root">not rendered</div>
    <script src="https://unpkg.com/react@16.8.4/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16.8.4/umd/react-dom.development.js"></script>
    <script>
      const App = () => {
        return React.createElement(
          'div',
          {},
          React.createElement('h1', {}, 'Adopt Me!')
        );
      };
      ReactDOM.render(
        React.createElement(App),
        document.getElementById('root')
      );
    </script>
  </body>
</html>
```

간단한 React 코드를 추가했다.

`React.createElement`로 tag를 생성한다. 그리고 `ReactDOM.render`를 이용하여 생성한 tag를 root에 넣는다.

render 되는 순간 기존의 코드는 모드 사라지고 새로 생성된 코드가 root에 들어간다.

`React.createElement`의 첫 번째 인자는 tag다.

두 번째 인자는 props다.

```html
<script>
  const App = () => {
    return React.createElement(
      'div',
      { id: 'this-is-ID' },
      React.createElement('h1', {}, 'Adopt Me!')
    );
  };
  ReactDOM.render(
    React.createElement(App),
    document.getElementById('root')
  );
</script>
```

위와 같이 두 번째 인자로 id를 전달하면 tag에 id가 추가된다.

세 번째 인자는 child다. 세 번째 인자로 Adopt Me! 같이 text가 오면 해당 tag의 value가 된다.

세 번째 인자는 배열이 될 수도 있다.

### App을 분리

html 코드에서 App을 별도의 파일로 분리해보자.

src/App.js

```js
const Pet = () => {
  return React.createElement('div', {}, [
    React.createElement('h1', {}, 'Luna'),
    React.createElement('h2', {}, 'Dog'),
    React.createElement('h2', {}, 'Havanese'),
  ]);
};

const App = () => {
  return React.createElement(
    'div',
    { id: 'this-is-ID' },
    [
      React.createElement('h1', {}, 'Adopt Me!'),
      React.createElement(Pet),
      React.createElement(Pet),
      React.createElement(Pet),
    ]
  );
};
ReactDOM.render(React.createElement(App), document.getElementById('root'));
```

App을 별도의 파일로 분리했고 Pet을 하나 만들어 App에서 사용했다.

Pet을 생성할 때 props를 전달할 수 있다.

```js
const Pet = (props) => {
  return React.createElement('div', {}, [
    React.createElement('h1', {}, props.name),
    React.createElement('h2', {}, props.animal),
    React.createElement('h2', {}, props.breed),
  ]);
};

const App = () => {
  return React.createElement('div', { id: 'this-is-ID' }, [
    React.createElement('h1', {}, 'Adopt Me!'),
    React.createElement(Pet, { name: 'Luna', animal: 'Dog', breed: 'A' }),
    React.createElement(Pet, { name: 'Sun', animal: 'Cat', breed: 'B' }),
    React.createElement(Pet, { name: 'Star', animal: 'Bird', breed: 'C' }),
  ]);
};
ReactDOM.render(React.createElement(App), document.getElementById('root'));
```

## 2. Hook을 이용하여 코드 수정

react, react-dom을 설치한다. 실행을 위해 parcel도 설치한다.

다음의 코드를 살펴보자.

src/SearchParams.js

```jsx
import React, { useState } from "react";
import { ANIMALS } from "@frontendmasters/pet";

const SearchParams = () => {
  const [location, setLocation] = useState("Seattle, WA");
  const [animal, setAnimal] = useState("dog");
  const [breed, setBreed] = useState("");
  const [breeds, setBreeds] = useState([]);

  return (
    <div className="search-params">
      <h1>{location}</h1>
      <form action="">
        <label htmlFor="location">
          Location
          <input
            type="text"
            name="location"
            id="location"
            value={location}
            placeholder="Location"
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <label htmlFor="animal">
          Animal
          <select
            name="animal"
            id="animal"
            value={animal}
            onChange={(e) => setAnimal(e.target.value)}
            onBlur={(e) => setAnimal(e.target.value)}
          >
            <option value="All">All</option>
            {ANIMALS.map((animal) => (
              <option key={animal} value={animal}>
                {animal}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="breed">
          Breed
          <select
            name="breed"
            id="breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            onBlur={(e) => setBreed(e.target.value)}
            disabled={!breeds.length}
          >
            <option value="all">All</option>
            {breeds.map((breedString) => (
              <option key={breedString} value={breedString}>
                {breedString}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SearchParams;
```

form의 각 항목에서 사용할 useState를 작성했다.

select tag가 반복되므로 useDropdown hook을 만들어 재사용한다.

src/Dropdown.js

```jsx
import React, { useState } from "react";
import { option } from "yargs";

const useDropdown = (label, defaultState, options) => {
  const [state, setState] = useState(defaultState);
  const id = `use-dropdown-${label.replace(" ", "").toLowerCase()}`;
  const Dropdown = () => (
    <label htmlFor={id}>
      {label}
      <select
        name={label}
        id={id}
        value={state}
        onChange={(e) => setState(e.target.value)}
        onBlur={(e) => setState(e.target.value)}
        disabled={option.length === 0}
      >
        <option value="all">All</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );

  return [state, Dropdown, setState];
};

export default useDropdown;
```

SearchParams에 useDropdown를 적용한다.

```jsx
import React, { useState } from "react";
import { ANIMALS } from "@frontendmasters/pet";
import useDropdown from "./useDropdown";

const SearchParams = () => {
  const [location, setLocation] = useState("Seattle, WA");
  const [breeds, setBreeds] = useState([]);

  const [animal, AnimalDropdown] = useDropdown("animal", "dog", ANIMALS);
  const [breed, BreedDropdown] = useDropdown("breed", "", breeds);

  return (
    <div className="search-params">
      <h1>{location}</h1>
      <form action="">
        <label htmlFor="location">
          Location
          <input
            type="text"
            name="location"
            id="location"
            value={location}
            placeholder="Location"
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <AnimalDropdown />
        <BreedDropdown />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SearchParams;
```

## 3. 코드 추가 & 개선

현재까지의 코드를 정리해보자.

src/App.js

```jsx
import React from "react";
import { render } from "react-dom";
import SearchParams from "./SearchParams";

const App = () => {
  return (
    <React.StrictMode>
      <div id="this-is-ID">
        <h1>Adopt Me!</h1>
        <SearchParams />
      </div>
    </React.StrictMode>
  );
};

render(<App />, document.getElementById("root"));
```

src/SearchParams.js

```jsx
import React, { useState, useEffect } from "react";
import pet, { ANIMALS } from "@frontendmasters/pet";
import useDropdown from "./useDropdown";
import Results from "./Results";

const SearchParams = () => {
  const [location, setLocation] = useState("Seattle, WA");
  const [breeds, setBreeds] = useState([]);
  const [pets, setPets] = useState([]);
  const [animal, AnimalDropdown] = useDropdown("animal", "dog", ANIMALS);
  const [breed, BreedDropdown, setBreed] = useDropdown("breed", "", breeds);

  useEffect(() => {
    setBreeds([]);
    setBreed("");

    pet.breeds(animal).then(({ breeds }) => {
      const breedStrings = breeds.map(({ name }) => name);
      setBreeds(breedStrings);
    }, console.error);
  }, [animal, setBreed, setBreeds]);

  const onSubmit = (e) => {
    e.preventDefault();
    pet
      .animals({
        location,
        breed,
        type: animal,
      })
      .then(({ animals }) => setPets(animals || []), console.error);
  };

  return (
    <div className="search-params">
      <h1>{location}</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="location">
          Location
          <input
            type="text"
            name="location"
            id="location"
            value={location}
            placeholder="Location"
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <AnimalDropdown />
        <BreedDropdown />
        <button>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
```

src/useDropdown.js

```js
import React, { useState } from "react";
import { option } from "yargs";

const useDropdown = (label, defaultState, options) => {
  const [state, setState] = useState(defaultState);
  const id = `use-dropdown-${label.replace(" ", "").toLowerCase()}`;
  const Dropdown = () => (
    <label htmlFor={id}>
      {label}
      <select
        name={label}
        id={id}
        value={state}
        onChange={(e) => setState(e.target.value)}
        onBlur={(e) => setState(e.target.value)}
        disabled={option.length === 0}
      >
        <option value="all">All</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );

  return [state, Dropdown, setState];
};

export default useDropdown;
```

src/Results.js

```js
import React from "react";
import Pet from "./Pet";

const Results = ({ pets }) => {
  return (
    <div className="search">
      {pets.length === 0 ? (
        <h1>No Pets Found</h1>
      ) : (
        pets.map((pet) => (
          <Pet
            key={pet.id}
            id={pet.id}
            animal={pet.type}
            name={pet.name}
            breed={pet.breeds.primary}
            media={pet.photos}
            location={`${pet.contact.address.city}, ${pet.contact.address.city}`}
          />
        ))
      )}
    </div>
  );
};

export default Results;
```

src/Pet.js

```jsx
import React from "react";

export default function Pet({ id, name, animal, breed, media, location }) {
  let hero = "http://placecorgi.com/300/300";
  if (media.length) {
    hero = media[0].small;
  }
  return (
    <a href={`/details/${id}`} className="pet">
      <div className="image-container">
        <img src={hero} alt={name} />
      </div>
      <div className="info">
        <h1>{name}</h1>
        <h2>{`${animal} - ${breed} - ${location}`}</h2>
      </div>
    </a>
  );
}
```

Details.js 파일을 추가하고 임시 코드를 작성한다.

```js
import React from "react";

const Details = () => {
  return <h1>Details</h1>;
};

export default Details;
```

Reach Router를 설치하자.

```cmd
yarn add @reach/router
```

App.js 파일에 routing을 추가한다.

```js
import React from "react";
import { render } from "react-dom";
import { Router, Link } from "@reach/router";
import SearchParams from "./SearchParams";
import Details from "./Details";

const App = () => {
  return (
    <React.StrictMode>
      <div id="this-is-ID">
        <header>
          <Link to="/">
            <h1>Adopt Me!</h1>
          </Link>
        </header>
        <Router>
          <SearchParams path="/" />
          <Details path="/details/:id" />
        </Router>
      </div>
    </React.StrictMode>
  );
};

render(<App />, document.getElementById("root"));
```

## 4. Class Component 사용해보기

### Details

Detail.js를 class component로 변경해보자.

```jsx
import React from "react";
import pet from "@frontendmasters/pet";

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  componentDidMount() {
    pet.animal(this.props.id).then(({ animal }) => {
      this.setState({
        name: animal.name,
        animal: animal.type,
        location: `${animal.contact.address.city}, ${animal.contact.address.state}`,
        description: animal.description,
        media: animal.photos,
        breed: animal.breeds.primary,
        loading: false,
      });
    });
  }
  render() {
    if (this.state.loading) {
      return <h1>loading...</h1>;
    }
    const { name, animal, location, description, media, breed } = this.state;
    return (
      <div className="details">
        <div>
          <h1>{name}</h1>
          <h2>{`${animal} - ${breed} - ${location}`}</h2>
          <button type="submit">Adopt {name}</button>
          <p>{description}</p>
        </div>
      </div>
    );
  }
}

export default Details;
```

js의 최신 문법을 사용하면 class 코드를 조금 더 간단하게 줄일 수 있다.

```jsx
import React from "react";
import pet from "@frontendmasters/pet";

class Details extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     loading: true,
  //   };
  // }
  state = { loading: true };
  componentDidMount() {
    pet.animal(this.props.id).then(({ animal }) => {
      this.setState({
        name: animal.name,
        animal: animal.type,
        location: `${animal.contact.address.city}, ${animal.contact.address.state}`,
        description: animal.description,
        media: animal.photos,
        breed: animal.breeds.primary,
        loading: false,
      });
    });
  }
  render() {
    if (this.state.loading) {
      return <h1>loading...</h1>;
    }
    const { name, animal, location, description, breed } = this.state;
    return (
      <div className="details">
        <div>
          <h1>{name}</h1>
          <h2>{`${animal} - ${breed} - ${location}`}</h2>
          <button type="submit">Adopt {name}</button>
          <p>{description}</p>
        </div>
      </div>
    );
  }
}

export default Details;
```

이렇게 사용하기 위해서는 babel이 필요하다.

```cmd
yarn add -D babel-eslint @babel/core @babel/preset-env @babel/plugin-proposal-class-properties @babel/preset-react
```

src/.babelrc 파일을 추가한다.

```json
{
  "presets": ["@babel/preset-react", "@babel/preset-env"],
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

eslint에 babel 설정을 추가한다.

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
    "prettier/react"
  ],
  "rules": {
    "react/prop-types": 0,
    "no-console": 1,
    "react-hooks/rules-of-hooks": 2,
    "react-hooks/exhaustive-deps": 1
  },
  "plugins": ["react", "import", "jsx-a11y", "react-hooks"],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

### Carousel

Carousel을 구현한다.

```jsx
import React from "react";

class Carousel extends React.Component {
  state = {
    photos: [],
    active: 0,
  };

  static getDerivedStateFromProps({ media }) {
    let photos = ["http://placecorgi.com/600/600"];
    if (photos.length) {
      photos = media.map(({ large }) => large);
    }
    return { photos };
  }

  handleIndexClick = (event) => {
    this.setState({
      active: +event.target.dataset.index,
    });
  };

  render() {
    const { photos, active } = this.state;
    return (
      <div className="carousel">
        <img src={photos[active]} alt="animal photos" />
        <div className="carousel-smaller">
          {this.props.media.map((photo, index) => (
            // eslint-disable-next-line
            <img
              key={photo.large}
              onClick={this.handleIndexClick}
              data-index={index}
              className={index === active ? "active" : ""}
              src={photo.large}
              alt="animal thumbnail"
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Carousel;
```

컴포넌트의 인스턴스가 생성되어 DOM에 삽입될 때 다음 순서대로 실행된다.

constructor

getDerivedStateFromProps

render

componentDidMount

특히 getDerivedStateFromProps는 생성 시점과 갱신 시점 모두 render가 호출되기 직전에 실행된다.

getDerivedStateFromProps가 return 하는 값은 state를 갱신한다.

img tag에서 data tag를 사용했다. 이것을 handleIndexClick 메서드에서 활용한다.

Details.js에 Carousel을 추가한다.

```jsx
import React from "react";
import pet from "@frontendmasters/pet";
import Carousel from "./Carousel";

class Details extends React.Component {
  state = { loading: true };
  componentDidMount() {
    pet.animal(this.props.id).then(({ animal }) => {
      this.setState({
        name: animal.name,
        animal: animal.type,
        location: `${animal.contact.address.city}, ${animal.contact.address.state}`,
        description: animal.description,
        media: animal.photos,
        breed: animal.breeds.primary,
        loading: false,
      });
    });
  }
  render() {
    if (this.state.loading) {
      return <h1>loading...</h1>;
    }
    const { name, animal, location, description, breed, media } = this.state;
    return (
      <div className="details">
        <Carousel media={media} />
        <div>
          <h1>{name}</h1>
          <h2>{`${animal} - ${breed} - ${location}`}</h2>
          <button type="submit">Adopt {name}</button>
          <p>{description}</p>
        </div>
      </div>
    );
  }
}

export default Details;
```

## 5. Error Boundary

ErrorBoundary는 class component로만 구현가능하다.

ErrorBoundary.js 파일을 생성한다.

```jsx
import React from "react";
import { Link } from "@reach/router";

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <h1>
          There was an error with this listing. <Link to="/">Click here</Link>{" "}
          to go back to the home page or wait five seconds.
        </h1>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

Details.js 파일에 ErrorBoundary를 적용한다.

```jsx
import React from "react";
import pet from "@frontendmasters/pet";
import Carousel from "./Carousel";
import ErrorBoundary from "./ErrorBoundary";

class Details extends React.Component {
  state = { loading: true };
  componentDidMount() {
    pet.animal(this.props.id).then(({ animal }) => {
      this.setState({
        name: animal.name,
        animal: animal.type,
        location: `${animal.contact.address.city}, ${animal.contact.address.state}`,
        description: animal.description,
        media: animal.photos,
        breed: animal.breeds.primary,
        loading: false,
      });
    });
  }
  render() {
    if (this.state.loading) {
      return <h1>loading...</h1>;
    }
    const { name, animal, location, description, breed, media } = this.state;
    return (
      <div className="details">
        <Carousel media={media} />
        <div>
          <h1>{name}</h1>
          <h2>{`${animal} - ${breed} - ${location}`}</h2>
          <button type="submit">Adopt {name}</button>
          <p>{description}</p>
        </div>
      </div>
    );
  }
}

// export default Details;
export default function DetailsWithErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <Details {...props} />
    </ErrorBoundary>
  );
}
```

Details에서 강제로 Error를 발생시키면 ErrorBoundary의 코드가 화면에 출력된다.

5초 뒤에 home으로 이동하는 코드를 추가한다.

```jsx
import React from "react";
import { Link, Redirect } from "@reach/router";

class ErrorBoundary extends React.Component {
  state = { hasError: false, redirect: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
  }
  componentDidUpdate() {
    if (this.state.hasError) {
      setTimeout(() => this.setState({ redirect: true }), 5000);
    }
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    if (this.state.hasError) {
      return (
        <h1>
          There was an error with this listing. <Link to="/">Click here</Link>{" "}
          to go back to the home page or wait five seconds.
        </h1>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

## 6. Context

ThemeContext.js 파일 생성

```js
import { createContext } from "react";

const ThemeContext = createContext(["green", () => {}]);

export default ThemeContext;
```

createContext로 ThemeContext를 생성한다.

createContext에 값과 함수를 초가값으로 전달했다.

App.js에 context를 추가한다.

```js
import React, { useState } from "react";
import { render } from "react-dom";
import { Router, Link } from "@reach/router";
import SearchParams from "./SearchParams";
import Details from "./Details";
import ThemeContext from "./ThemeContext";

const App = () => {
  const themeHook = useState("darkblue");
  return (
    <React.StrictMode>
      <ThemeContext.Provider value={themeHook}>
        <div id="this-is-ID">
          <header>
            <Link to="/">
              <h1>Adopt Me!</h1>
            </Link>
          </header>
          <Router>
            <SearchParams path="/" />
            <Details path="/details/:id" />
          </Router>
        </div>
      </ThemeContext.Provider>
    </React.StrictMode>
  );
};

render(<App />, document.getElementById("root"));
```

themeHook이라는 useState를 하나 생성한다.

themeHook은 일반적인 useState와 달리 단일 변수로 생성했다.

이 themeHook을 ThemeContext.Provider에 전달한다.

Provider에 전달하는 themeHook을 다른 것으로 변경하는 UI를 만들면 간단하게 theme을 변경할 수 있게 된다.

이제 context를 사용해보자.

SearchParams.js

```js
import React, { useState, useEffect, useContext } from "react";
import pet, { ANIMALS } from "@frontendmasters/pet";
import useDropdown from "./useDropdown";
import Results from "./Results";
import ThemeContext from "./ThemeContext";

const SearchParams = () => {
  const [location, setLocation] = useState("Seattle, WA");
  const [breeds, setBreeds] = useState([]);
  const [pets, setPets] = useState([]);
  const [animal, AnimalDropdown] = useDropdown("animal", "dog", ANIMALS);
  const [breed, BreedDropdown, setBreed] = useDropdown("breed", "", breeds);
  const [theme] = useContext(ThemeContext);

  useEffect(() => {
    setBreeds([]);
    setBreed("");

    pet.breeds(animal).then(({ breeds }) => {
      const breedStrings = breeds.map(({ name }) => name);
      setBreeds(breedStrings);
    }, console.error);
  }, [animal, setBreed, setBreeds]);

  const onSubmit = (e) => {
    e.preventDefault();
    pet
      .animals({
        location,
        breed,
        type: animal,
      })
      .then(({ animals }) => setPets(animals || []), console.error);
  };

  return (
    <div className="search-params">
      <h1>{location}</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="location">
          Location
          <input
            type="text"
            name="location"
            id="location"
            value={location}
            placeholder="Location"
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <AnimalDropdown />
        <BreedDropdown />
        <button style={{ backgroundColor: theme }}>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
```

useContext를 이용해여 theme을 로드했다.

App.js에서 ​darkblue를 context에 입력했기 때문에 현재 값은 darkblue이다.

Submit 버튼에서 확인해볼 수 있다.

class components에서 context를 사용해보자.

```jsx
import React from "react";
import pet from "@frontendmasters/pet";
import Carousel from "./Carousel";
import ErrorBoundary from "./ErrorBoundary";
import ThemeContext from "./ThemeContext";

class Details extends React.Component {
  state = { loading: true };
  componentDidMount() {
    pet.animal(this.props.id).then(({ animal }) => {
      this.setState({
        name: animal.name,
        animal: animal.type,
        location: `${animal.contact.address.city}, ${animal.contact.address.state}`,
        description: animal.description,
        media: animal.photos,
        breed: animal.breeds.primary,
        loading: false,
      });
    });
  }
  render() {
    if (this.state.loading) {
      return <h1>loading...</h1>;
    }
    const { name, animal, location, description, breed, media } = this.state;
    return (
      <div className="details">
        <Carousel media={media} />
        <div>
          <h1>{name}</h1>
          <h2>{`${animal} - ${breed} - ${location}`}</h2>
          <ThemeContext.Consumer>
            {(themeHook) => (
              <button type="button" style={{ backgroundColor: themeHook[0] }}>
                Adopt {name}
              </button>
            )}
          </ThemeContext.Consumer>
          {/* <button type="button">Adopt {name}</button> */}
          <p>{description}</p>
        </div>
      </div>
    );
  }
}

// export default Details;
export default function DetailsWithErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <Details {...props} />
    </ErrorBoundary>
  );
}
```

ThemeContext.Consumer tag를 이용하여 context를 사용할 수 있다.

Theme을 변경할 수 있는 UI를 추가한다.

```jsx
import React, { useState, useEffect, useContext } from "react";
import pet, { ANIMALS } from "@frontendmasters/pet";
import useDropdown from "./useDropdown";
import Results from "./Results";
import ThemeContext from "./ThemeContext";

const SearchParams = () => {
  const [location, setLocation] = useState("Seattle, WA");
  const [breeds, setBreeds] = useState([]);
  const [pets, setPets] = useState([]);
  const [animal, AnimalDropdown] = useDropdown("animal", "dog", ANIMALS);
  const [breed, BreedDropdown, setBreed] = useDropdown("breed", "", breeds);
  const [theme, setTheme] = useContext(ThemeContext);

  useEffect(() => {
    setBreeds([]);
    setBreed("");

    pet.breeds(animal).then(({ breeds }) => {
      const breedStrings = breeds.map(({ name }) => name);
      setBreeds(breedStrings);
    }, console.error);
  }, [animal, setBreed, setBreeds]);

  const onSubmit = (e) => {
    e.preventDefault();
    pet
      .animals({
        location,
        breed,
        type: animal,
      })
      .then(({ animals }) => setPets(animals || []), console.error);
  };

  return (
    <div className="search-params">
      <h1>{location}</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="location">
          Location
          <input
            type="text"
            name="location"
            id="location"
            value={location}
            placeholder="Location"
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <AnimalDropdown />
        <BreedDropdown />
        <label htmlFor="theme">
          Theme
          <select
            name="theme"
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onBlur={(e) => setTheme(e.target.value)}
          >
            <option value="peru">Peru</option>
            <option value="darkblue">Dark Blue</option>
            <option value="mediumorchid">Medium Orchid</option>
            <option value="chartreuse">Chart Reuse</option>
          </select>
        </label>
        <button style={{ backgroundColor: theme }}>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
```

Theme이라는 select를 추가했다.

dropdown에서 항목을 선택할 때마다 setTheme에 의해 context가 변경된다.

Details 페이지의 버튼도 함께 변경되도록 Pet.js 파일도 수정한다.

a tag를 Link로 변경했다.

```jsx
import React from "react";
import { Link } from "@reach/router";

export default function Pet({ id, name, animal, breed, media, location }) {
  let hero = "http://placecorgi.com/300/300";
  if (media.length) {
    hero = media[0].small;
  }
  return (
    <Link to={`/details/${id}`} className="pet">
      <div className="image-container">
        <img src={hero} alt={name} />
      </div>
      <div className="info">
        <h1>{name}</h1>
        <h2>{`${animal} - ${breed} - ${location}`}</h2>
      </div>
    </Link>
  );
}
```

## 7. Potals

index.html에 Modal을 위한 div를 하나 추가한다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Adopt Me!</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div id="modal"></div>
    <div id="root">not rendered</div>
    <script src="App.js"></script>
  </body>
</html>
```

Modal.js 파일을 생성한다.

```jsx
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children }) => {
  const elRef = useRef(null);
  if (!elRef.current) {
    const div = document.createElement("div");
    elRef.current = div;
  }

  useEffect(() => {
    console.log(elRef.current);
    const modalRoot = document.getElementById("modal");
    modalRoot.appendChild(elRef.current);
    return () => modalRoot.removeChild(elRef.current);
  }, []);

  return createPortal(<div>{children}</div>, elRef.current);
};

export default Modal;
```

elRef라는 useRef를 생성했다. elRef는 새롭게 생성된 div를 가리킨다.

useEffect에서 index.html에 생성된 Modal을 불러온다. 그리고 이 Modal의 child로 elRef를 등록한다.

useEffect의 return으로 removeChild도 잊지말자.

이 useEffect는 단 한번만 실행되도록 dependency에 빈 배열만 추가했다.

Details.js에 Modal을 추가한다.

```js
import React from "react";
import pet from "@frontendmasters/pet";
import { navigate } from "@reach/router";
import Modal from "./Modal";
import Carousel from "./Carousel";
import ErrorBoundary from "./ErrorBoundary";
import ThemeContext from "./ThemeContext";

class Details extends React.Component {
  state = { loading: true, showModal: false };
  componentDidMount() {
    pet.animal(this.props.id).then(({ animal }) => {
      this.setState({
        url: animal.url,
        name: animal.name,
        animal: animal.type,
        location: `${animal.contact.address.city}, ${animal.contact.address.state}`,
        description: animal.description,
        media: animal.photos,
        breed: animal.breeds.primary,
        loading: false,
      });
    });
  }

  toggleModal = () => this.setState({ showModal: !this.state.showModal });

  adopt = () => navigate(this.state.url);

  render() {
    if (this.state.loading) {
      return <h1>loading...</h1>;
    }
    const {
      name,
      animal,
      location,
      description,
      breed,
      media,
      showModal,
    } = this.state;
    return (
      <div className="details">
        <Carousel media={media} />
        <div>
          <h1>{name}</h1>
          <h2>{`${animal} - ${breed} - ${location}`}</h2>
          <ThemeContext.Consumer>
            {(themeHook) => (
              <button
                type="button"
                style={{ backgroundColor: themeHook[0] }}
                onClick={this.toggleModal}
              >
                Adopt {name}
              </button>
            )}
          </ThemeContext.Consumer>
          {/* <button type="button">Adopt {name}</button> */}
          <p>{description}</p>
          {showModal ? (
            <Modal>
              <div>
                <h1>Would you like to adopt {name}?</h1>
                <div className="buttons">
                  <button type="button" onClick={this.adopt}>
                    Yes
                  </button>
                  <button type="button" onClick={this.toggleModal}>
                    No
                  </button>
                </div>
              </div>
            </Modal>
          ) : null}
        </div>
      </div>
    );
  }
}

// export default Details;
export default function DetailsWithErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <Details {...props} />
    </ErrorBoundary>
  );
}
```

state에 showModal porperty를 추가했다.

그리고 Modal의 yes, no 버튼에 따라 동작할 두 메서드를 생성했다.

No 버튼을 클릭하면 toggleModal 메서드가 실행된다.

## 배운 점, 느낀 점

중간 중간에 React.createElement, parcel 같은 잘 모르는 내용이 있어서 재미있었다.

parcel은 예전에 시험삼아 써봤다가 설정을 못해서 고생했었는데, 이젠 설정이 아예 없이도 잘 동작하는 것 같다. 물론 뒤로 갈수록 다르겠지만.

React.createElement를 처음 접해봤다. React tag를 조금 더 이해할 수 있게 된 것 같은 느낌?이다.
