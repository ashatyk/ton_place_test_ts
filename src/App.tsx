import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import {
  AutocompleteOption,
  AutocompleteMultiple
} from './components/autocomplete';
import {theme} from "./theme";

const DemoPage = styled('div')`
  background-color: ${({theme}) =>  theme.palette.color_background_content};
  min-height: 100vh;
  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`

//equal to response of https://qbzvhxqakg.api.quickmocker.com/ton-place-moc-api/langs
const options: AutocompleteOption[] = [
  {
    "value": 2,
    "renderFields": {
      "label": {
        "title": "Aari",
        "variant": "primary"
      },
      "description": {
        "title": "Аари",
        "variant": "subhead"
      }
    }
  },

  {
    "value": 3,
    "renderFields": {
      "label": {
        "title": "Абаза Бызшва",
        "variant": "primary"
      },
      "description": {
        "title": "Абазинский",
        "variant": "subhead"
      }
    }
  },

  {
    "value": 4,
    "renderFields": {
      "label": {
        "title": "Аҧсшәа",
        "variant": "primary"
      },
      "description": {
        "title": "Абхазский",
        "variant": "subhead"
      }
    }
  },
  {
    "value": 5,
    "renderFields": {
      "label": {
        "title": "अवधी",
        "variant": "primary"
      },
      "description": {
        "title": "Авадхи",
        "variant": "subhead"
      }
    }
  },

  {
    "value": 6,
    "renderFields": {
      "label": {
        "title": "Авар мацӏ (МагІарул мацӏ)",
        "variant": "primary"
      },
      "description": {
        "title": "Аварский",
        "variant": "subhead"
      }
    }
  },

  {
    "value": 7,
    "renderFields": {
      "label": {
        "title": "Агъул чIал ",
        "variant": "primary"
      },
      "description": {
        "title": "Агульский",
        "variant": "subhead"
      }
    }
  },

  {
    "value": 8,
    "renderFields": {
      "label": {
        "title": "Dangme ",
        "variant": "primary"
      },
      "description": {
        "title": "Адангме",
        "variant": "subhead"
      }
    }
  },

  {
    "value": 9,
    "renderFields": {
      "label": {
        "title": "Адыгабзэ ",
        "variant": "primary"
      },
      "description": {
        "title": "Адыгейский",
        "variant": "subhead"
      }
    }
  },

  {
    "value": 10,
    "renderFields": {
      "label": {
        "title": "Azərbaycan dili ",
        "variant": "primary"
      },
      "description": {
        "title": "Азербайджанский",
        "variant": "subhead"
      }
    }
  }
]

const mockDataEndpoint = `https://qbzvhxqakg.api.quickmocker.com/ton-place-moc-api/langs`

function App() {

  const [mockData,setMockData] = React.useState<AutocompleteOption[]>()
  // Too Many Requests: You have reached your daily request limit (100 requests).   :(
  React.useEffect(() => {
    fetch(mockDataEndpoint)
      .then((response) => response.json())
      .then((actualData) => setMockData(actualData))
      .catch((err) => {console.log(err.message)});
  }, []);

  const [firstValue, setFirstValue] = React.useState<AutocompleteOption[]>([])

  const [secondValue, setSecondValue] = React.useState<AutocompleteOption[]>([])

  return (
    <ThemeProvider theme={theme}>
        <DemoPage>
          <AutocompleteMultiple
            options={options}
            selectedOptions={firstValue}
            onChange={option => setFirstValue(option)}
            inputPlaceholder={'Select options'}
            popperPlaceholder={'Nothing found'}
            getTagLabel={(option) => option.renderFields['label'].title}
          />
          {mockData && <AutocompleteMultiple
            options={mockData}
            selectedOptions={secondValue}
            onChange={option => setSecondValue(option)}
            inputPlaceholder={'Select options'}
            popperPlaceholder={'Nothing found'}
            getTagLabel={(option) => option.renderFields['label'].title}
          /> }
        </DemoPage>
    </ThemeProvider>
  );
}

export default App;
