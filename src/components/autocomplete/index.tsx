import React from "react"
import styled from "styled-components";
import {Popper, PopperOption, PopperOptionsSubhead, PopperOptionsPrimary} from "../../elements/popper";
import { IconButton } from "../../elements/iconButton";
import {Highlight} from "../../elements/highlight";
import {ReactComponent as DeleteIcon} from '../../icons/delete.svg';
import {ReactComponent as DropdownIcon} from '../../icons/dropdown.svg';

export interface AutocompleteWrapperProps {
  autocompletePopperOpen: boolean
}

const AutocompleteWrapper = styled(`div`)<AutocompleteWrapperProps>`
  width: 300px;
  min-height: 30px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px;
  outline: none;
  border: 1px solid ${({theme}) => theme.palette.color_field_border_alpha};
  background-color: ${({theme}) => theme.palette.color_field_background};
  //also similar to top-popper scenario
  border-radius: 
          ${({theme}) => theme.size.size_border_radius__regular}
          ${({theme}) => theme.size.size_border_radius__regular}
          ${({theme,autocompletePopperOpen}) => !autocompletePopperOpen ? theme.size.size_border_radius__regular : 0}
          ${({theme,autocompletePopperOpen}) => !autocompletePopperOpen ? theme.size.size_border_radius__regular : 0};
  
  &:hover {
    border: 1px solid ${({theme}) => theme.palette.color_field_border_alpha__hover}
    background-color: ${({theme}) => theme.palette.color_field_background__hover};
  }
  cursor: text;
`

const AutocompleteBase = styled(`span`)`
  display: flex;
  gap: 3px;
  flex-grow: 1;
  flex-wrap: wrap;
`

const AutocompleteBaseChip = styled(`button`)`
  height: ${({theme}) => theme.size.size_button_small_height__compact};
  border: none;
  display: flex;
  align-items: center;
  border-radius: ${({theme}) => theme.size.size_check_border_radius__regular};
  background-color: ${({theme}) => theme.palette.color_search_field_background};
  color: ${({theme}) => theme.palette.color_text_accent_themed};
  padding: 4px 4px 5px 7px;
  gap: 3px;
  pointer-events: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
`

const AutocompleteBaseInput = styled('input')`
  background: 0 0;
  flex-grow: 2;
  min-width: 20%;
  outline: 0;
  border: 0;
  padding: 1px 0 2px 3px;
  text-overflow: ellipsis;
  color: ${({theme}) => theme.palette.color_text_accent_themed};
`

export enum AutocompleteRenderFieldVariant{
  primary = 'primary',
  subhead = 'subhead',
}
export interface AutocompleteRenderField{
  title: string;
  variant: AutocompleteRenderFieldVariant | string
}

export type AutocompleteOption = {
  value: number
  readonly renderFields: Record<keyof any, AutocompleteRenderField>
}

type AutocompleteMultipleProps = {
  selectedOptions: AutocompleteOption[]
  onChange: (value: AutocompleteOption[]) => void
  inputPlaceholder: string;
  popperPlaceholder: string;
  getTagLabel: (option: AutocompleteOption) => string;
}

type AutocompleteCommonProps = {
  options: AutocompleteOption[]
}

type AutocompleteProps =  AutocompleteCommonProps & AutocompleteMultipleProps

const autocompleteRenderFields = {
  [AutocompleteRenderFieldVariant.primary]: PopperOptionsPrimary,
  [AutocompleteRenderFieldVariant.subhead]: PopperOptionsSubhead,
}

export const AutocompleteMultiple: React.FunctionComponent<AutocompleteProps> = ({
     selectedOptions,
     onChange,
     options = [],
     inputPlaceholder,
     popperPlaceholder,
     getTagLabel
}) => {

  const optionsWithRefs = options.map((option) => ({...option, ref: React.createRef<HTMLLIElement>()}))

  const [autocompletePopperOpen, setAutocompletePopperOpen] = React.useState(false)

  const [autocompletePopperHoverIndex, _setAutocompletePopperHoverIndex] = React.useState(0)

  const [autocompleteInputValue,setAutocompleteInputValue] = React.useState<string>('')

  const [autocompleteRenderOptions,setAutocompleteRenderOptions] = React.useState(optionsWithRefs)

  const autocompleteWrapperRef = React.useRef<HTMLDivElement>(null)

  const autocompleteInputRef = React.useRef<HTMLInputElement>(null)

  const setAutocompletePopperScrollIndex = (index: number) => {
    autocompleteRenderOptions?.[index]?.ref?.current?.scrollIntoView({
      block: "nearest"
    });
  }

  const setAutocompletePopperHoverIndex = (index: number) => {
    setAutocompletePopperScrollIndex(index)
    _setAutocompletePopperHoverIndex(index)
  }

  const resetAutocompletePopperHoverIndex = () => setAutocompletePopperHoverIndex(0)

  const onAutocompleteWrapperClick = () => {
    setAutocompletePopperOpen(true)
    autocompleteInputRef.current?.focus()
    resetAutocompletePopperHoverIndex()
  }

  const onAutocompleteWrapperFocus = () => {
    autocompleteInputRef.current?.focus()
    resetAutocompletePopperHoverIndex()
  }
  const onAutocompleteToggleClick = (event: React.MouseEvent<HTMLDivElement>) => {

    event.stopPropagation()

    if(!autocompletePopperOpen){
      autocompleteInputRef.current?.focus()
      setAutocompletePopperOpen(true)
    }
    else {
      autocompleteInputRef.current?.blur()
      setAutocompletePopperOpen(false)
    }

  }

  const onAutocompleteSelectedOptionClick = (option: AutocompleteOption) => (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()

    onChange(selectedOptions.filter(selectedOption => selectedOption.value !== option.value))

    autocompleteInputRef.current?.focus()

    setAutocompletePopperOpen(true)

    resetAutocompletePopperHoverIndex()

  }

  const onAutocompletePopperOptionClick = (option: AutocompleteOption) => (event: React.MouseEvent<HTMLLIElement>) => {
    event.stopPropagation()

    onChange([...selectedOptions, option])

    setAutocompleteInputValue('')

    resetAutocompletePopperHoverIndex()
  }

  const onAutocompleteInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutocompleteInputValue(event.target.value)
  }

  const onAutocompletePopperOptionMouseMove = (index: number) => () => {
    setAutocompletePopperHoverIndex(index)
  }

  //filter render options with input value && already selected options
  React.useEffect(() => {

    if(!autocompletePopperOpen && autocompleteInputValue){
      setAutocompletePopperOpen(true)
    }

    if(autocompletePopperOpen){
      resetAutocompletePopperHoverIndex()
    }

    setAutocompleteRenderOptions(
      optionsWithRefs
        .filter(option =>
          Object.values(option.renderFields)
            .reduce((acc: string[], value) =>  [...acc,value.title],[])
            .join('')
            .toLowerCase()
            .includes(autocompleteInputValue.toLowerCase()))
        .filter(option => !selectedOptions.map(option => option.value).includes(option.value))
    )

  },[autocompleteInputValue, selectedOptions])

  //handle autocomplete outside click event
  React.useEffect(() => {
    const handler = (event: MouseEvent) =>{
      if(autocompleteWrapperRef.current && !autocompleteWrapperRef.current.contains(event.target as Node)){
        setAutocompletePopperOpen(false)
      }
    }


    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);

  }, [autocompleteWrapperRef]);

  //handle autocomplete keyboard events
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {

      switch (e.code) {

        case "Tab":{
          e.preventDefault()

          if(!autocompletePopperOpen) {
            setAutocompletePopperOpen(true);

            autocompleteInputRef.current?.focus()

            resetAutocompletePopperHoverIndex()
          }

          if(autocompletePopperOpen) {
            setAutocompletePopperOpen(false);

            autocompleteInputRef.current?.blur()
          }

          break
        }
        case "Escape":{

          if(autocompletePopperOpen) {
            setAutocompletePopperOpen(false);
            autocompleteInputRef.current?.blur()
          }

          break
        }

        case "Enter":{

          if(!autocompletePopperOpen) return

          if(autocompleteRenderOptions?.[autocompletePopperHoverIndex]){

            onChange([...selectedOptions, autocompleteRenderOptions[autocompletePopperHoverIndex]])

            setAutocompleteInputValue('')

            resetAutocompletePopperHoverIndex()

          }

          break
        }

        case "Backspace":{

          if(autocompleteInputValue.length === 0) {
            onChange(selectedOptions.slice(0, -1))

            resetAutocompletePopperHoverIndex()
          }

          break
        }

        case "ArrowUp":{

          e.preventDefault();

          const shiftedAutocompletePopperHoverIndex = autocompletePopperHoverIndex - 1

          if (shiftedAutocompletePopperHoverIndex >= 0) {
            setAutocompletePopperHoverIndex(shiftedAutocompletePopperHoverIndex)
          }

          break
        }

        case "ArrowDown": {

          e.preventDefault();

          const shiftedAutocompletePopperHoverIndex = autocompletePopperHoverIndex + 1

          if (shiftedAutocompletePopperHoverIndex < autocompleteRenderOptions.length){
            setAutocompletePopperHoverIndex(shiftedAutocompletePopperHoverIndex)
          }

          break

        }
      }
    }
    autocompleteInputRef.current?.addEventListener("keydown", handler)

    return () => {
      autocompleteInputRef.current?.removeEventListener("keydown", handler)
    }
  }, [
    autocompleteInputValue,
    autocompletePopperHoverIndex,
    autocompletePopperOpen,
    selectedOptions,
    autocompleteRenderOptions
  ])

  return (
    <AutocompleteWrapper
      ref={autocompleteWrapperRef}
      tabIndex={0}
      onClick={onAutocompleteWrapperClick}
      onFocus={onAutocompleteWrapperFocus}
      autocompletePopperOpen={autocompletePopperOpen}
    >
      <AutocompleteBase>
        {selectedOptions.map(selectedOption => (
          <AutocompleteBaseChip key={selectedOption.value}>
            {getTagLabel(selectedOption)}
            <IconButton onClick={onAutocompleteSelectedOptionClick(selectedOption)}>
              <DeleteIcon/>
            </IconButton>
          </AutocompleteBaseChip>
        ))}
        <AutocompleteBaseInput
          ref={autocompleteInputRef}
          value={autocompleteInputValue}
          onChange={onAutocompleteInputValueChange}
          placeholder={!selectedOptions.length ? inputPlaceholder : ''}
        />
      </AutocompleteBase>
      <IconButton onClick={onAutocompleteToggleClick}>
        <DropdownIcon/>
      </IconButton>
      <Popper popperOpen={autocompletePopperOpen}>

        {!autocompleteRenderOptions.length &&
          <PopperOption isLastElement>
            <PopperOptionsSubhead>
              {popperPlaceholder}
            </PopperOptionsSubhead>
          </PopperOption>
        }

        {autocompleteRenderOptions.map((option, index,{length}) => (
          <PopperOption
            key={option.value}
            onClick={onAutocompletePopperOptionClick(option)}
            onMouseMove={onAutocompletePopperOptionMouseMove(index)}
            isOptionHighlighted={index === autocompletePopperHoverIndex}
            isLastElement={index === length - 1}
            ref={option.ref}
          >
            {Object.values(option.renderFields).map((field) => {

              const RenderComponent = autocompleteRenderFields?.[field?.variant as AutocompleteRenderFieldVariant]
                || autocompleteRenderFields[AutocompleteRenderFieldVariant.primary];

              return (
                <RenderComponent>
                  <Highlight match={autocompleteInputValue}>
                    {field.title}
                  </Highlight>
                </RenderComponent>
              )

            })}
          </PopperOption>
        ))}

      </Popper>
    </AutocompleteWrapper>
  )
}
