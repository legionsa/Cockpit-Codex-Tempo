import React from 'react';
import { Page } from '@/types/page';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero } from '@/components/PageHero';
import { NavigationCards } from '@/components/NavigationCards';

interface LandingLayoutProps {
    page: Page;
}

export function LandingLayout({ page }: LandingLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />
            <div className="flex-1">
                <PageHero page={page} />
                <NavigationCards page={page} />
            </div>
            <SiteFooter />
        </div>
    );
}
