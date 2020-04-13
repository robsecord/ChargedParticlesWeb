import React, { Component } from 'react';

const withContext = CustomContext => CustomTarget => {
    class WithContext extends Component {
        constructor(props) {
            super(props);
        }
        render() {
            return (
                <CustomContext>
                    <CustomTarget
                        {...{
                            ...this.props
                        }}
                    />
                </CustomContext>
            );
        }
    }

    WithContext.displayName = `withContext(${CustomTarget.displayName || CustomTarget.name})`;

    return WithContext;
};
