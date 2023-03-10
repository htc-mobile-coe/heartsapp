export const styles = props => {
    return {
        focused: {
            color: props.brandPrimary,
            fontSize: 22
        },

        icon: {
            color: '#707070',
            fontSize: 22
        },

        labelStyle: { fontFamily: props.normalFont },

        tabbar: {
            backgroundColor: props.tabBarBackgroundColor,
            borderTopWidth: 0,
        },
    };
};
