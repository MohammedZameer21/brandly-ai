import { describe, expect, it } from 'vitest';
import { analyze, calculate, calendar, pillars, validProfile, type Profile } from './App';

const aisha:Profile={name:'Aisha Khan',type:'Student',role:'Third-year computer science student',skills:'Python, machine learning, React, data analysis',experience:'Two academic projects: a recommendation system.',goal:'Secure an internship',audience:'Recruiters and software / AI professionals',platform:'LinkedIn',tone:'Professional',time:3,bio:''};

describe('BrandPilot scoring and planning rules',()=>{
 it('uses the declared score rubric and awards points from supplied profile data',()=>{
  const result=calculate(aisha,pillars(aisha),calendar(aisha,pillars(aisha)));
  expect(result.parts.map(x=>x[1])).toEqual([20,20,20,16,20]);
  expect(result.total).toBe(96);
 });
 it('matches planned post frequency to available hours up to a five-post cap',()=>{
  expect(calendar(aisha,pillars(aisha))).toHaveLength(3);
  expect(calendar({...aisha,time:1},pillars(aisha))).toHaveLength(1);
  expect(calendar({...aisha,time:9},pillars(aisha))).toHaveLength(5);
 });
 it('creates profile-specific pillars and post ideas',()=>{
  const student=pillars(aisha),founder=pillars({...aisha,type:'Founder',goal:'Business growth'});
  expect(student[0].name).toBe('Projects in progress');
  expect(founder[0].name).toBe('Building the business');
  expect(student[0].ideas[0]).toContain('Two academic projects');
 });
 it('requires the core profile fields while allowing experience and bio to be optional',()=>{
  expect(validProfile(aisha)).toBe(true);
  expect(validProfile({...aisha,experience:'',bio:''})).toBe(true);
  expect(validProfile({...aisha,audience:'   '})).toBe(false);
 });
 it('flags potential mismatches and returns an explainable next step',()=>{
  const repeated=calendar(aisha,pillars(aisha)).map(p=>({...p,pillar:'Projects in progress'}));
  const result=analyze(aisha,pillars(aisha),repeated);
  expect(result.issues.some(x=>x.title==='Broaden the weekly mix')).toBe(true);
  expect(result.issues[0].fix.length).toBeGreaterThan(10);
  expect(result.score).toBeLessThan(100);
 });
 it('flags a missing audience while keeping the consistency score within bounds',()=>{
  const result=analyze({...aisha,audience:''},pillars({...aisha,audience:''}),calendar(aisha,pillars(aisha)));
  expect(result.issues.some(x=>x.title==='Make the intended audience explicit')).toBe(true);
  expect(result.score).toBeGreaterThanOrEqual(55);
  expect(result.score).toBeLessThanOrEqual(100);
 });
 it('flags a bio edit that drops the intended audience',()=>{
  const result=analyze({...aisha,bio:'I am a Python developer.'},pillars(aisha),calendar(aisha,pillars(aisha)));
  expect(result.issues.some(x=>x.title==='Reconnect your bio with its audience')).toBe(true);
 });
});
