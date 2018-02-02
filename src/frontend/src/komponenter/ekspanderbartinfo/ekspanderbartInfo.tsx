import * as React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import Ikon from 'nav-frontend-ikoner-assets';
import { FormattedMessage } from 'react-intl';
import * as classNames from 'classnames';

interface EgenProps {
    tittelId: string;
    children?: Array<React.ReactElement<Element>> | React.ReactElement<Element>;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface EgenStateProps {
    apen: boolean;
}

class EkspanderbartInfo extends React.PureComponent<EgenProps, EgenStateProps> {
    constructor(props: EgenProps) {
        super(props);
        this.state = {
            apen: false,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        const { onClick } = this.props;
        if (onClick) {
            onClick(e);
        }
        this.setState({
            apen: !this.state.apen
        });
    }

    render() {
        const {className } = this.props;
        return (
            <div className={classNames('bla-italic', className)}>
                <button
                    className="knapp-reset blokk-xxs"
                    onClick={this.handleClick}
                    aria-expanded={this.state.apen}
                >
                    <Normaltekst className="flex-align-items-start">
                        <span className="mmr"><Ikon kind="help-circle" size={25} className=""/></span>
                        <FormattedMessage id={this.props.tittelId}/>
                    </Normaltekst>
                </button>
                {
                    this.state.apen
                        ?
                        <div className="pxll">{this.props.children}</div>
                        : null
                }
            </div>
        );
    }
}

export default EkspanderbartInfo;