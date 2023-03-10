import React from 'react';
import { render } from 'TestUtils';
import {
    ArrowDown,
    EyeOff,
    CloseCircle,
    AngleDown,
    SignIn,
    SignOut,
    Menu,
    CheckboxChecked,
    CheckboxUnChecked,
    MailOutline,
    RadioChecked,
    RadioUnChecked,
    Close,
    PlayCircleFilled,
    PlayCircle,
    Play,
    Eye,
    Search,
    BookmarkO,
    Tune,
    ArrowLeft,
    AngleRight,
    AngleUp,
    ChevronCircleRight,
    ChevronCircleLeft,
    Music,
    Star,
    Lock,
    UnLock,
    ArrowCircleLeftBlock,
    Home,
    Info,
    Circle,
    FavoriteBorder,
    ChevronUp,
    Clock,
    Locked,
    Location,
    Check,
    Exclamation,
    Add,
    Remove,
    Lens,
} from './index';

describe('Icons ', () => {
    const expectIcon = (Icon) => {
        const { container } = render(<Icon />);
        expect(container).toBeDefined();
    };

    it('Material ', () => {
        expectIcon(ArrowDown);
        expectIcon(MailOutline);
        expectIcon(CheckboxUnChecked);
        expectIcon(CheckboxChecked);
        expectIcon(RadioUnChecked);
        expectIcon(RadioChecked);
        expectIcon(Close);
        expectIcon(PlayCircleFilled);
        expectIcon(PlayCircle);
        expectIcon(Play);
        expectIcon(Eye);
        expectIcon(Search);
        expectIcon(BookmarkO);
        expectIcon(Tune);
        expectIcon(ArrowLeft);
        expectIcon(Home);
        expectIcon(FavoriteBorder);
        expectIcon(Info);
        expectIcon(Menu);
        expectIcon(Add);
        expectIcon(Remove);
        expectIcon(Lens);
    });

    it('MaterialCommunity ', () => {
        expectIcon(ArrowCircleLeftBlock);
        expectIcon(EyeOff);
        expectIcon(Circle);
        expectIcon(Clock);
        expectIcon(Locked);
    });

    it('FontAwesome ', () => {
        expectIcon(AngleRight);
        expectIcon(AngleDown);
        expectIcon(AngleUp);
        expectIcon(ChevronCircleRight);
        expectIcon(ChevronCircleLeft);
        expectIcon(Music);
        expectIcon(Star);
        expectIcon(ChevronUp);
        expectIcon(Check);
        expectIcon(Exclamation);
    });

    it('EvilIcons ', () => {
        expectIcon(Lock);
        expectIcon(CloseCircle);
        expectIcon(UnLock);
        expectIcon(Location);
    });
    it('Feather ', () => {
        expectIcon(SignIn);
        expectIcon(SignOut);
        expectIcon(UnLock);
    });
});
