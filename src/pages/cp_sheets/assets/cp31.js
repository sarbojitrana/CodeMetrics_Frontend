import problems from './problems.json' assert { type: 'json' };

const rating_800 = problems.filter(problem => problem.rating === 800);
const rating_900 = problems.filter(problem => problem.rating === 900);
const rating_1000 = problems.filter(problem => problem.rating === 1000);
const rating_1100 = problems.filter(problem => problem.rating === 1100);
const rating_1200 = problems.filter(problem => problem.rating === 1200);
const rating_1300 = problems.filter(problem => problem.rating === 1300);
const rating_1400 = problems.filter(problem => problem.rating === 1400);
const rating_1500 = problems.filter(problem => problem.rating === 1500);
const rating_1600 = problems.filter(problem => problem.rating === 1600);

export {rating_1000,rating_1100,rating_1200,rating_1300,rating_1400,rating_1500,rating_1600,rating_800,rating_900};