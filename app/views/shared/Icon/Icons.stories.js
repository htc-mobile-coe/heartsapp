import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../../i18n';
import {
    ArrowLeft,
    Tune,
    BookmarkO,
    Search,
    Eye,
    Lock,
    CheckboxChecked,
    CheckboxUnChecked,
    Star,
    Music,
    Play,
    Close,
    ChevronCircleLeft,
    RadioChecked,
    RadioUnChecked,
    ChevronCircleRight,
    PlayCircle,
    PlayCircleFilled,
    UnLock,
    Menu,
    ArrowDown,
    ArrowCircleLeftBlock,
    Home,
    EyeOff,
    Locked,
    CloseCircle,
    AngleRight,
    AngleDown,
    AngleUp,
    MailOutline,
    SignIn,
    SignOut,
    Location,
    Check,
    Add,
    Remove,
    Exclamation,
    Circle,
    Info,
    Lens,
    ChevronUp,
    Clock
} from './index';
import CenterView from '../CenterView';

const fontSize = {
    fontSize: 100,
};

storiesOf('Icons', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('ArrowDown', () => <ArrowDown style={fontSize} />)
    .add('ArrowLeft', () => <ArrowLeft style={fontSize} />)
    .add('Tune', () => <Tune style={fontSize} />)
    .add('BookmarkO', () => <BookmarkO style={fontSize} />)
    .add('Search', () => <Search style={fontSize} />)
    .add('Eye', () => <Eye style={fontSize} />)
    .add('Lock', () => <Lock style={fontSize} />)
    .add('UnLock', () => <UnLock style={fontSize} />)
    .add('Star', () => <Star style={fontSize} />)
    .add('Music', () => <Music style={fontSize} />)
    .add('Play', () => <Play style={fontSize} />)
    .add('PlayCircle', () => <PlayCircle style={fontSize} />)
    .add('PlayCircleFilled', () => <PlayCircleFilled style={fontSize} />)
    .add('Close', () => <Close style={fontSize} />)
    .add('ChevronCircleLeft', () => <ChevronCircleLeft style={fontSize} />)
    .add('ChevronCircleRight', () => <ChevronCircleRight style={fontSize} />)
    .add('RadioChecked', () => <RadioChecked style={fontSize} />)
    .add('RadioUnChecked', () => <RadioUnChecked style={fontSize} />)
    .add('CheckboxUnChecked', () => <CheckboxUnChecked style={fontSize} />)
    .add('CheckboxChecked', () => <CheckboxChecked style={fontSize} />)
    .add('EyeOff', () => <EyeOff style={fontSize} />)
    .add('Locked', () => <Locked style={fontSize} />)
    .add('ArrowCircleLeftBlock', () => <ArrowCircleLeftBlock style={fontSize} />)
    .add('Home', () => <Home style={fontSize} />)
    .add('CloseCircle', () => <CloseCircle style={fontSize} />)
    .add('AngleRight', () => <AngleRight style={fontSize} />)
    .add('AngleDown', () => <AngleDown style={fontSize} />)
    .add('AngleUp', () => <AngleUp style={fontSize} />)
    .add('MailOutline', () => <MailOutline style={fontSize} />)
    .add('SignIn', () => <SignIn style={fontSize} />)
    .add('SignOut', () => <SignOut style={fontSize} />)
    .add('Menu', () => <Menu style={fontSize} />)
    .add('Location', () => <Location style={fontSize} />)
    .add('Check', () => <Check style={fontSize} />)
    .add('Exclamation', () => <Exclamation style={fontSize} />)
    .add('Add', () => <Add style={fontSize} />)
    .add('Remove', () => <Remove style={fontSize} />)
    .add('Info', () => <Info style={fontSize} />)
    .add('Circle', () => <Circle style={fontSize} />)
    .add('Lens', () => <Lens style={fontSize} />)
    .add('ChevronUp', () => <ChevronUp style={fontSize} />)
    .add('Clock', () => <Clock style={fontSize} />);
