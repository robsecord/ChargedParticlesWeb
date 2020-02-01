import React, { Component } from 'react';

const withStore = CustomStore => CustomTarget => {
    class WithStore extends Component {
        constructor(props) {
            super(props);
        }
        render() {
            return (
                <CustomStore>
                    <CustomTarget
                        {...{
                            ...this.props
                        }}
                    />
                </CustomStore>
            );
        }
    }

    WithStore.displayName = `withStore(${CustomTarget.displayName || CustomTarget.name})`;

    return WithStore;
};
