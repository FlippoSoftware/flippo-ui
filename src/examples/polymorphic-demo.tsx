/**
 * Демонстрация автоматического определения типа компонента
 */

import React from 'react';

import { Button } from '../components/Button';

export function PolymorphicDemo() {
    return (
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <h3>{'Автоматическое определение типа по пропам'}</h3>

            {/* Кнопка - НЕТ href = рендерится как button */}
            <Button
              variant={'primary'}
              size={'medium'}
              disabled={true}
              onClick={() => { /* handle click */ }}
            >
                {'Это кнопка (без href)'}
            </Button>

            {/* Ссылка - ЕСТЬ href = рендерится как anchor */}
            <Button
              href={'https://example.com'}
              target={'_blank'}
              rel={'noreferrer noopener'}
              variant={'link'}
              size={'medium'}
            >
                {'Это ссылка (с href)'}
            </Button>

            {/*
            ❌ ОШИБКИ TypeScript:

            // Нельзя disabled для ссылки
            <Button
                href="https://example.com"
                disabled={true} // Error!
            >
                Invalid
            </Button>

            // Нельзя href для кнопки
            <Button
                onClick={() => {}}
                href="https://example.com" // Error!
            >
                Invalid
            </Button>
            */}
        </div>
    );
}
