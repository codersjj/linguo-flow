import React from 'react';
import { StageViewClient } from '@/components/StageViewClient';
import { Stage } from '@/types';

interface StagePageProps {
    params: Promise<{
        stage: string;
    }>;
}

export default async function StagePage({ params }: StagePageProps) {
    const { stage } = await params;
    const validStage = stage as Stage;

    return <StageViewClient stage={validStage} />;
}
