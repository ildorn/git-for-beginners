import React, { Component, createElement } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { TransitionGroup } from 'react-transition-group';

import ChapterHeader from './ChapterHeader';
import { ChapterText, ChapterReadOn, ChapterCheckbox } from './Chapter';
import { SECTION_TEXT, SECTION_TASK } from '../constants';
import ChapterTip from './ChapterTip';
import { readOn } from '../models/Chapter';
import ChapterSectionTransition from './ChapterSectionTransition';

@observer
class ChapterBody extends Component {
  @action.bound readOn() {
    const { chapter } = this.props;

    chapter.dispatch(readOn());
  }

  renderSections() {
    const { chapter } = this.props;

    return (
      <TransitionGroup>
        {chapter.visibleSections.map((section, index) => {
          if (section.is(SECTION_TEXT)) {
            return (
              <ChapterSectionTransition key={index}>
                <ChapterText>
                  {createElement(section.text)}
                </ChapterText>
              </ChapterSectionTransition>
            );
          }

          if (section.is(SECTION_TASK)) {
            return (
              <ChapterSectionTransition key={index}>
                <ChapterCheckbox checked={section.done}>
                {createElement(section.text)}
                </ChapterCheckbox>
                {
                  section.tip != null && <ChapterTip>{section.tip}</ChapterTip>
                }
              </ChapterSectionTransition>
            );
          }

          throw new Error('Unknown section type.');
        })}
      </TransitionGroup>
    );
  }

  renderReadOn() {
    const { chapter } = this.props;
    const lastSection = chapter.visibleSections[chapter.visibleSections.length - 1];

    if (
      lastSection == null ||
      !lastSection.is(SECTION_TEXT) ||
      chapter.completed
    ) {
      return null;
    }

    return <ChapterReadOn onClick={this.readOn}>Read On</ChapterReadOn>;
  }

  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        {this.renderSections()}
        {this.renderReadOn()}
      </div>
    );
  }
}

export default styled(ChapterBody)`
  position: relative;
  hyphens: auto;

  ${ChapterHeader} + & {
    margin-top: ${props => props.theme.spacing()};
  }

  & > * + * {
    margin-top: ${props => props.theme.spacing(0.75)};
  }

  strong {
    font-weight: 600;
    color: ${props => props.theme.color.highlight};
  }

  code {
    ${props => props.theme.mixins.monospaced};
    white-space: nowrap;
    background-color: white;
    padding: ${props => props.theme.spacing(0.1)} ${props => props.theme.spacing(0.3)};
    margin: 0 ${props => props.theme.spacing(-0.25)};
    border-radius: ${props => props.theme.borderRadius.large};
  }
`;
