import * as React from 'react';
import { PersonContext } from '../App';

export interface HelloProps {
    compiler: string;
    framework: string;
}

export function Hello(props: HelloProps) {
    const personContext = React.useContext(PersonContext);
    return (
        <div>
            <h1>
                Hello from {props.compiler} and {props.framework}!
            </h1>
            <h2>
                {personContext.name} loves {personContext.love}
            </h2>
        </div>
    );
}
