import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';

factory.define(
  'Spot',
  {},
  {
    _id: faker.string.uuid,
    user: null,
    company: faker.company.name,
    price: () => Number(faker.finance.amount()),
    thumbnail: () => faker.system.fileName({ extension: 'jpg' }),
    thumbnail_url: faker.image.url,
    techs: () => {
      const techs = [];
      for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i += 1) {
        techs.push(faker.lorem.word());
      }
      return techs;
    },
  }
);

factory.define(
  'Booking',
  {},
  {
    _id: faker.string.uuid,
    date: () => faker.date.future().toISOString(),
    user: {
      email: faker.internet.email,
    },
    spot: {
      company: faker.company.name,
    },
  }
);

export default factory;
