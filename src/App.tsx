import { Col, Container, Row } from 'reactstrap';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact';
import { useEffect, useState } from 'react';
import { average, standartDeviation } from './util';
import MySketch from './MySketch';
import 'mdbootstrap/css/bootstrap.min.css';
import 'mdbootstrap/css/mdb.min.css';

function App() {
  const [finished, setFinished] = useState(false);
  const [probe, setProbe] = useState(0);
  const [tests, setTests] = useState<number[][]>([[], [], [], [], []]);

  useEffect(() => {
    if (probe >= 5) {
      setFinished(true);
      return;
    }

    if (tests[probe].length >= 20) setProbe(probe + 1);
  }, [tests, probe]);

  const averages = tests.map((test) => average(test.map(Math.abs)));
  const standartDeviations = tests.map((test) =>
    standartDeviation(test.map(Math.abs))
  );
  const advanceTests = tests.map((test) =>
    test.filter((x) => x < 0).map(Math.abs)
  );
  const lagTests = tests.map((test) => test.filter((x) => x > 0).map(Math.abs));

  function renderReactions(
    reactions: number[][],
    name: string,
    shortName: string
  ) {
    const averages = reactions.map(average);
    const standartDeviations = reactions.map(standartDeviation);
    console.log(standartDeviations);
    const insideStandartDeviations = reactions.map(
      (test, i) => test.filter((x) => x <= standartDeviations[i]).length
    );
    const outsideStandartDeviations = reactions.map(
      (test, i) => test.filter((x) => x > standartDeviations[i]).length
    );

    const percentOutsideStandartDeviations = outsideStandartDeviations.map(
      (d, i) => (d * 100) / tests[i].length
    );

    const mins = reactions.map((test) => Math.min(...test));
    const maxs = reactions.map((test) => Math.max(...test));

    return {
      insideStandartDeviations,
      render: (
        <>
          <tr>
            <th rowSpan={10}>
              {name} ({shortName})
            </th>
            <th>Общее количество {shortName}</th>
            {reactions.map((test, i) => (
              <td key={i}>{test.length}</td>
            ))}
          </tr>

          <tr>
            <th>Кол-во {shortName} в диапазоне СКО</th>
            {insideStandartDeviations.map((d, i) => (
              <td key={i}>{d}</td>
            ))}
          </tr>

          <tr>
            <th>Кол-во {shortName} вне диапазона СКО</th>
            {outsideStandartDeviations.map((d, i) => (
              <td key={i}>{d}</td>
            ))}
          </tr>

          <tr>
            <th>% {shortName} вне диапазона СКО</th>
            {percentOutsideStandartDeviations.map((percent, i) => (
              <td key={i}>{isFinite(percent) ? percent.toFixed(2) : '-'}</td>
            ))}
          </tr>

          <tr>
            <th>Ср. время/ мсек</th>
            {averages.map((avg, i) => (
              <td key={i}>{isFinite(avg) ? avg.toFixed(2) : '-'}</td>
            ))}
          </tr>

          <tr>
            <th>Мин. время реакции/ мсек</th>
            {mins.map((min, i) => (
              <td key={i}>{isFinite(min) ? min.toFixed(2) : '-'}</td>
            ))}
          </tr>

          <tr>
            <th>Макс. время реакции/ мсек</th>
            {maxs.map((max, i) => (
              <td key={i}>{isFinite(max) ? max.toFixed(2) : '-'}</td>
            ))}
          </tr>

          <tr>
            <th>СКО/ мсек</th>
            {standartDeviations.map((d, i) => (
              <td key={i}>{isFinite(d) ? d.toFixed(2) : '-'}</td>
            ))}
          </tr>

          <tr>
            <th>Вариационный размах/ мсек</th>
            {maxs.map((max, i) => {
              const d = max - mins[i];
              return <td key={i}>{isFinite(d) ? d.toFixed(2) : '-'}</td>;
            })}
          </tr>

          <tr>
            <th>Коэффициент вариации, %</th>
            {standartDeviations.map((sd, i) => {
              const d = (sd * 100) / averages[i];
              return <td key={i}>{isFinite(d) ? d.toFixed(2) : '-'}</td>;
            })}
          </tr>
        </>
      ),
    };
  }

  const correctReactions = tests.map(
    (test) => test.filter((x) => x === 0).length
  );
  const temp1 = renderReactions(advanceTests, 'Реакция опережения', 'РО');
  const lagInsideSD = temp1.insideStandartDeviations;
  const lagElem = temp1.render;
  const temp2 = renderReactions(lagTests, 'Реакция запаздывания', 'РЗ');
  const advanceInsideSD = temp2.insideStandartDeviations;
  const advanceElem = temp2.render;

  return (
    <>
      {!finished ? (
        <MySketch probe={probe} tests={tests} setTests={setTests} />
      ) : (
        <></>
      )}
      <Container>
        <Row>
          <Col>
            <MDBTable bordered>
              <MDBTableHead>
                <tr>
                  <th colSpan={2}></th>
                  <th colSpan={5}>Номер пробы</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                <tr>
                  <th colSpan={2}>Показатели</th>
                  {tests.map((_, i) => (
                    <td key={i}>{i + 1}</td>
                  ))}
                </tr>

                <tr>
                  <th colSpan={2}>Количество стимулов</th>
                  {tests.map((test, i) => (
                    <td key={i}>{test.length}</td>
                  ))}
                </tr>

                <tr>
                  <th colSpan={2}>Среднее время реакции/ мсек</th>
                  {averages.map((avg, i) => (
                    <td key={i}>{isFinite(avg) ? avg.toFixed(2) : '-'}</td>
                  ))}
                </tr>

                <tr>
                  <th colSpan={2}>Правильные реакции - количество</th>
                  {correctReactions.map((k, i) => (
                    <td key={i}>{k}</td>
                  ))}
                </tr>

                {lagElem}
                {advanceElem}

                <tr>
                  <th colSpan={2}>% реакций в диапазоне СКО</th>
                  {correctReactions.map((k, i) => (
                    <td key={i}>
                      {tests[i].length
                        ? ((k + lagInsideSD[i] + advanceInsideSD[i]) * 100) /
                          tests[i].length
                        : '-'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <th colSpan={2}>Общий коэффициет вариации, %</th>
                  {standartDeviations.map((sd, i) => {
                    const d = (sd * 100) / averages[i];
                    return <td key={i}>{isFinite(d) ? d.toFixed(2) : '-'}</td>;
                  })}
                </tr>
              </MDBTableBody>
            </MDBTable>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
