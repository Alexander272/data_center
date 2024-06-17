package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type CompleteCriterionRepo struct {
	db *sqlx.DB
}

func NewCompleteCriterionRepo(db *sqlx.DB) *CompleteCriterionRepo {
	return &CompleteCriterionRepo{
		db: db,
	}
}

type CompleteCriterion interface {
	GetByDate(context.Context, *models.GetCompeteDTO) ([]*models.CompleteCount, error)
	Create(context.Context, *models.CompleteCriterionDTO) error
	DeleteOld(context.Context, string) error
}

func (r *CompleteCriterionRepo) GetByDate(ctx context.Context, req *models.GetCompeteDTO) ([]*models.CompleteCount, error) {
	query := fmt.Sprintf(`SELECT COUNT(criterion_id), date FROM %s AS cc INNER JOIN %s AS c ON c.id=criterion_id
		WHERE date>=$1 AND key=ANY($2) GROUP BY date ORDER BY date`,
		CompleteCriterionTable, CriterionsTable,
	)
	comCount := []*models.CompleteCount{}

	/*
		Чтобы учитывать ежемесячные критерии приходится дополнительно выводить тип, а потом все считать (к тому надо сделать так чтобы ежемесячные параметры можно было заполнить только раз в месяц, иначе это все будет криво работать)

		SELECT COUNT(criterion_id), type, date FROM complete_criterion AS cc INNER JOIN criterions AS c ON c.id=criterion_id
			WHERE date>=1717441200
			OR (type='monthly' AND date_part('month',to_timestamp(date))=date_part('month',to_timestamp(1717441200)))
			GROUP BY date, type ORDER BY date
	*/

	if err := r.db.SelectContext(ctx, &comCount, query, req.Date, pq.Array(req.EnabledKeys)); err != nil {
		return nil, fmt.Errorf("failed to execute complete count query. error: %w", err)
	}

	return comCount, nil

	// complete := []*models.Complete{}
	// if len(comCount) == 0 {
	// 	return complete, nil
	// }

	// conditions := []string{}
	// params := []interface{}{}
	// j := 2
	// for i, c := range comCount {
	// 	date := time.Unix(c.Date, 0)
	// 	types := []string{constants.DailyCriterion, constants.MonthlyCriterion}
	// 	if int(date.Weekday())%6 != 0 {
	// 		types = append(types, constants.InWeekdaysCriterion)
	// 	}
	// 	conditions = append(conditions, fmt.Sprintf("(date=$%d AND c.type=ANY($%d))", i*j+1, i*j+2))
	// 	params = append(params, c.Date, pq.Array(types))
	// }

	// TODO похоже это все не работает нормально. Может стоит получать данные только из таблицы CriterionsTable в зависимости от массивов. Надо еще подумать над этим
	// query = fmt.Sprintf(`SELECT Count(c.id), date FROM %s AS c
	// 	LEFT JOIN %s AS cc ON cc.criterion_id=c.id
	// 	WHERE %s
	// 	GROUP BY date ORDER BY date`,
	// 	CriterionsTable, CompleteCriterionTable, strings.Join(conditions, " OR "),
	// )
	// count := []*models.CompleteCount{}

	// if err := r.db.SelectContext(ctx, &count, query, params...); err != nil {
	// 	return nil, fmt.Errorf("failed to execute count query. error: %w", err)
	// }

	// for _, c := range count {
	// 	for _, cc := range comCount {
	// 		if cc.Date == c.Date {
	// 			complete = append(complete, &models.Complete{
	// 				Date:          c.Date,
	// 				Complete:      c.Count == cc.Count,
	// 				CompleteCount: cc.Count,
	// 				Count:         c.Count,
	// 			})
	// 			break
	// 		}
	// 	}
	// }

	// return complete, nil
}

func (r *CompleteCriterionRepo) Create(ctx context.Context, dto *models.CompleteCriterionDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, criterion_id, date) VALUES(:id, :criterion_id, :date)`, CompleteCriterionTable)
	id := uuid.New()
	dto.Id = id.String()

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

// func (r *CompleteCriterionRepo) Create(ctx context.Context, dto *models.CompleteCriterionDTO) error {
// 	query := fmt.Sprintf(`INSERT INTO %s(id, role_id, type, date, criterion_id)
// 		VALUES ($1, (SELECT id FROM %s WHERE name=$2 LIMIT 1), $3,  $4, $5)`,
// 		CompleteCriterionTable, RoleTable,
// 	)
// 	id := uuid.New()

// 	_, err := r.db.ExecContext(ctx, query, id, dto.Role, dto.Type, dto.Date, dto.CriterionId)
// 	if err != nil {
// 		return fmt.Errorf("failed to execute query. error: %w", err)
// 	}
// 	return nil
// }

func (r *CompleteCriterionRepo) DeleteOld(ctx context.Context, date string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE date<$1`, CompleteCriterionTable)

	_, err := r.db.ExecContext(ctx, query, date)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
