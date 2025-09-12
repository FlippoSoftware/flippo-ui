/**
 * Примеры использования Button компонента с автоматическим определением типа
 */

import React from 'react';

import { Button } from '../components/Button';

export function ButtonExamples() {
    return (
        <div>
            <h3>{'Автоматическое определение типа элемента'}</h3>

            {/* ✅ Кнопка - НЕТ href = рендерится как button */}
            <Button
              variant={'primary'}
              size={'medium'}
              disabled={true}
              onClick={() => { /* handle click */ }}
            >
                {'Regular Button'}
            </Button>

            {/* ✅ Ссылка - ЕСТЬ href = рендерится как anchor */}
            <Button
              href={'https://example.com'}
              target={'_blank'}
              rel={'noreferrer noopener'}
              variant={'link'}
              size={'medium'}
            >
                {'Link Button'}
            </Button>

            {/* ❌ TypeScript Error - нельзя disabled для ссылки с href */}
            {/*
            <Button
                href="https://example.com"
                disabled={true}  // Error: Types of property 'disabled' are incompatible
                variant="link"
            >
                Invalid Link
            </Button>
            */}

            {/* ❌ TypeScript Error - нельзя href для кнопки */}
            {/*
            <Button
                variant="primary"
                href="https://example.com"  // Error: Types of property 'href' are incompatible
                onClick={() => {}}
            >
                Invalid Button
            </Button>
            */}
        </div>
    );
}
