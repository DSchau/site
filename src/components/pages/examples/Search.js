import React from 'react'
import styled from 'styled-components'

import { Box, Card, DropDown, TextField, ResponsiveStack } from 'serverless-design-system'
import searchIcon from 'src/assets/images/search-icon.svg'

const ExamplesSearchField = styled(TextField)`
    background: url(${searchIcon}) no-repeat;
    background-position: right 15px center;
    background-color: white;
    background-size: 17.5px;
    border-left: 1px solid #5b5b5b;

    &:focus, &:active {
      outline: none;
    }

    @media screen and (max-width: 412px) {
      border: 1px solid #5b5b5b;
    }
`

const BoxWithMobileBorder = styled(Box)`
  @media screen and (max-width: 412px) {
    border: 1px solid #5b5b5b;
  }
`

export default class Search extends React.Component {

  constructor (props){
      super(props)
      this.state = {
        filter: {
          platform: props.selectedOptions.platform,
          language: props.selectedOptions.language,
          framework: props.selectedOptions.framework,
          search: props.selectedOptions.search
        },
      }
  }

  state = { isSearchBarActive: false }

  filterSearchResults = (category, {label}) => {
    const updatedFilterObj = this.state.filter
    updatedFilterObj[category] = label === 'Any' ? null: label
    this.updateFilterAndRefreshResults(updatedFilterObj)
  } 

  handQueryFilter = (e) => {
    const updatedFilterObj = this.state.filter
    updatedFilterObj.search = e.target.value 
    this.updateFilterAndRefreshResults(updatedFilterObj)
  }

  updateFilterAndRefreshResults = (updatedFilterObj) => {
    this.setState({
      filter: updatedFilterObj
    })
    this.props.refreshResults(updatedFilterObj)
  }

  render() { 
    return (
    <Card
      border='1px solid #5b5b5b'
      m={[2]}
      mt={5}
    >
    <ResponsiveStack>

    
    <BoxWithMobileBorder mx={[0,0,2]}>
      <DropDown
        placeholder='platform'
        fieldContainerProps={{
          border: 'none',
          minWidth: '175px'
        }}
        placeholderProps={{ color: '#5b5b5b' }}
        options={[
            { label: 'Any', value: 'any'},
            { label: 'AWS', value: 'aws' },
            { label: 'Google Cloud', value: 'gcp' },
            { label: 'Azure', value: 'azure' },
            { label: 'OpenWhisk', value: 'openwhisk'},
            { label: 'Kubeless', value: 'kubeless'}
        ]}
        value = {this.state.filter.platform}
        onChange={this.filterSearchResults.bind(this, 'platform')}
        />
      </BoxWithMobileBorder>
      <BoxWithMobileBorder mx={[0,0,2]}>
      <DropDown
      placeholder='language'
        fieldContainerProps={{
          border: 'none',
          minWidth: '175px'
        }}
        placeholderProps={{ color: '#5b5b5b' }}
        options={[
            { label: 'Any', value: 'any'},
            { label: 'nodeJS', value: 'node' },
            { label: 'Go', value: 'go' },
            { label: 'Python', value: 'python'},
            { label: 'Swift', value: 'swift'},
            { label: 'Java', value: 'java'},
            { label: 'PHP', value: 'php'}
        ]}
        value = {this.state.filter.language}
        onChange={this.filterSearchResults.bind(this, 'language')}
        />
      </BoxWithMobileBorder>
      <BoxWithMobileBorder mx={[0, 0, 2]}>
      <DropDown
        placeholder='framework'
        fieldContainerProps={{
          border: 'none',
          minWidth: '175px'
        }}
        placeholderProps={{ color: '#5b5b5b' }}
        options={[
            { label: 'Any', value: 'any'},
            { label: 'v1', value: 'v1' },
        ]}
        value = {this.state.filter.framework}
        onChange={this.filterSearchResults.bind(this, 'framework')}
        />
      </BoxWithMobileBorder>
      <ExamplesSearchField
        placeholder='Search for an example'
        height={50}
        width='100%'
        border='none'
        fontSize={2}
        fontFamily='Serverless'
        placeholderColor='#8c8c8c'
        px={[1,1,2]}
        onChange={this.handQueryFilter}
      />
      </ResponsiveStack>
    </Card>
    
)

      }
    }